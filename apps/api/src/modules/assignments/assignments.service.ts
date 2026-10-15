import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../../common/constants/roles.enum';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { CourseSection } from '../course-sections/entities/course-section.entity';
import { Assignment } from './entities/assignment.entity';
import { Submission } from './entities/submission.entity';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment) private readonly assignmentsRepo: Repository<Assignment>,
    @InjectRepository(Submission) private readonly submissionsRepo: Repository<Submission>,
    @InjectRepository(Student) private readonly studentsRepo: Repository<Student>,
    @InjectRepository(Enrollment) private readonly enrollmentsRepo: Repository<Enrollment>,
    @InjectRepository(Teacher) private readonly teachersRepo: Repository<Teacher>,
    @InjectRepository(CourseSection) private readonly sectionsRepo: Repository<CourseSection>,
  ) {}

  async findAll(user: AuthenticatedUser) {
    if (user.role === Role.STUDENT) {
      const student = await this.studentsRepo.findOne({ where: { userId: user.id } });
      if (!student) throw new NotFoundException('Student profile not found for this account');
      const enrollments = await this.enrollmentsRepo.find({
        where: { studentId: student.id, status: 'approved' },
      });
      const sectionIds = [...new Set(enrollments.map(({ courseSectionId }) => courseSectionId))];
      return sectionIds.length
        ? this.assignmentsRepo.find({
            where: { courseSectionId: In(sectionIds) },
            order: { dueDate: 'ASC' },
          })
        : [];
    }
    if (user.role === Role.TEACHER) {
      const teacher = await this.teachersRepo.findOne({ where: { userId: user.id } });
      if (!teacher) throw new NotFoundException('Teacher profile not found for this account');
      const sections = await this.sectionsRepo.find({ where: { teacherId: teacher.id } });
      const sectionIds = sections.map(({ id }) => id);
      return sectionIds.length
        ? this.assignmentsRepo.find({
            where: { courseSectionId: In(sectionIds) },
            order: { dueDate: 'ASC' },
          })
        : [];
    }
    return this.assignmentsRepo.find({ order: { dueDate: 'ASC' } });
  }

  async findOne(id: number, user?: AuthenticatedUser) {
    const assignment = await this.assignmentsRepo.findOne({ where: { id } });
    if (!assignment) throw new NotFoundException(`Assignment #${id} not found`);
    if (user) await this.assertCanAccess(assignment, user);
    return assignment;
  }

  async create(data: Partial<Assignment>, user: AuthenticatedUser) {
    if (!data.courseSectionId) throw new BadRequestException('A course section is required.');
    const maxScore = Number(data.maxScore);
    const dueDate = data.dueDate ? new Date(data.dueDate) : null;
    if (!data.title?.trim()) throw new BadRequestException('An assignment title is required.');
    if (!dueDate || !Number.isFinite(dueDate.getTime())) throw new BadRequestException('A valid due date is required.');
    if (!Number.isFinite(maxScore) || maxScore <= 0) throw new BadRequestException('Maximum score must be greater than zero.');
    if (user.role === Role.TEACHER) await this.assertTeacherOwnsSection(user.id, data.courseSectionId);
    return this.assignmentsRepo.save(this.assignmentsRepo.create({
      courseSectionId: data.courseSectionId,
      title: data.title.trim(),
      description: data.description,
      dueDate,
      maxScore,
      createdBy: user.id,
    }));
  }

  async update(id: number, data: Partial<Assignment>, user: AuthenticatedUser) {
    const assignment = await this.findOne(id, user);
    if (data.title !== undefined && !data.title.trim()) throw new BadRequestException('Assignment title cannot be empty.');
    if (data.dueDate !== undefined && !Number.isFinite(new Date(data.dueDate).getTime())) {
      throw new BadRequestException('A valid due date is required.');
    }
    if (data.maxScore !== undefined && (!Number.isFinite(Number(data.maxScore)) || Number(data.maxScore) <= 0)) {
      throw new BadRequestException('Maximum score must be greater than zero.');
    }
    if (data.courseSectionId && user.role === Role.TEACHER) {
      await this.assertTeacherOwnsSection(user.id, data.courseSectionId);
    }
    await this.assignmentsRepo.update(id, {
      courseSectionId: data.courseSectionId ?? assignment.courseSectionId,
      title: data.title?.trim() ?? assignment.title,
      description: data.description ?? assignment.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : assignment.dueDate,
      maxScore: data.maxScore === undefined ? assignment.maxScore : Number(data.maxScore),
    });
    return this.findOne(id, user);
  }

  async remove(id: number, user: AuthenticatedUser) {
    const assignment = await this.findOne(id, user);
    await this.assignmentsRepo.remove(assignment);
    return { message: `Assignment #${id} deleted` };
  }

  async getSubmissions(assignmentId: number, user: AuthenticatedUser) {
    await this.findOne(assignmentId, user);
    return this.submissionsRepo.find({
      where: { assignmentId },
      order: { submittedAt: 'DESC' },
    });
  }

  async getMySubmission(assignmentId: number, userId: number) {
    await this.findOne(assignmentId, { id: userId, role: Role.STUDENT });
    const student = await this.studentsRepo.findOne({ where: { userId } });
    if (!student) throw new NotFoundException('Student profile not found for this account');
    return this.submissionsRepo.findOne({
      where: { assignmentId, studentId: student.id },
    });
  }

  async submit(
    assignmentId: number,
    userId: number,
    data: Pick<Submission, 'submissionText' | 'filePath'>,
  ) {
    const assignment = await this.findOne(assignmentId, { id: userId, role: Role.STUDENT });
    const student = await this.studentsRepo.findOne({ where: { userId } });
    if (!student) throw new NotFoundException('Student profile not found for this account');
    const enrollment = await this.enrollmentsRepo.findOne({
      where: {
        studentId: student.id,
        courseSectionId: assignment.courseSectionId,
        status: 'approved',
      },
    });
    if (!enrollment) throw new NotFoundException('You must be enrolled in this course to submit work.');
    if (!data.submissionText?.trim() && !data.filePath?.trim()) {
      throw new BadRequestException('Provide written work or a file link.');
    }

    const existing = await this.submissionsRepo.findOne({
      where: { assignmentId, studentId: student.id },
    });
    const submission = this.submissionsRepo.create({
      ...existing,
      assignmentId: assignment.id,
      studentId: student.id,
      submissionText: data.submissionText?.trim() || null,
      filePath: data.filePath?.trim() || null,
      status: 'submitted',
      score: null,
      feedback: null,
      gradedBy: null,
      gradedAt: null,
    });
    return this.submissionsRepo.save(submission);
  }

  async gradeSubmission(
    assignmentId: number,
    submissionId: number,
    user: AuthenticatedUser,
    score: number,
    feedback?: string,
  ) {
    const assignment = await this.findOne(assignmentId, user);
    const submission = await this.submissionsRepo.findOne({
      where: { id: submissionId, assignmentId },
    });
    if (!submission) throw new NotFoundException(`Submission #${submissionId} not found`);
    if (!Number.isFinite(score) || score < 0 || score > Number(assignment.maxScore)) {
      throw new BadRequestException(`Score must be between 0 and ${assignment.maxScore}.`);
    }
    submission.score = score;
    submission.feedback = feedback?.trim() || null;
    submission.status = 'graded';
    submission.gradedBy = user.id;
    submission.gradedAt = new Date();
    return this.submissionsRepo.save(submission);
  }

  private async assertCanAccess(assignment: Assignment, user: AuthenticatedUser) {
    if (user.role === Role.TEACHER) {
      await this.assertTeacherOwnsSection(user.id, assignment.courseSectionId);
    } else if (user.role === Role.STUDENT) {
      const student = await this.studentsRepo.findOne({ where: { userId: user.id } });
      if (!student) throw new NotFoundException('Student profile not found for this account');
      const enrollment = await this.enrollmentsRepo.findOne({
        where: {
          studentId: student.id,
          courseSectionId: assignment.courseSectionId,
          status: 'approved',
        },
      });
      if (!enrollment) throw new ForbiddenException('You are not enrolled in this course.');
    }
  }

  private async assertTeacherOwnsSection(userId: number, sectionId: number) {
    const teacher = await this.teachersRepo.findOne({ where: { userId } });
    if (!teacher) throw new NotFoundException('Teacher profile not found for this account');
    const section = await this.sectionsRepo.findOne({
      where: { id: sectionId, teacherId: teacher.id },
    });
    if (!section) throw new ForbiddenException('You can only manage assignments for your assigned sections.');
  }
}