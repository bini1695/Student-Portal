import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../../common/constants/roles.enum';
import { Department } from '../departments/entities/department.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { CourseSection } from '../course-sections/entities/course-section.entity';
import { FinancialHold } from '../financial-holds/entities/financial-hold.entity';
import { Grade } from './entities/grade.entity';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade) private readonly repo: Repository<Grade>,
    @InjectRepository(Enrollment) private readonly enrollmentsRepo: Repository<Enrollment>,
    @InjectRepository(Student) private readonly studentsRepo: Repository<Student>,
    @InjectRepository(Teacher) private readonly teachersRepo: Repository<Teacher>,
    @InjectRepository(CourseSection) private readonly sectionsRepo: Repository<CourseSection>,
    @InjectRepository(Department) private readonly departmentsRepo: Repository<Department>,
    @InjectRepository(FinancialHold) private readonly financialHoldsRepo: Repository<FinancialHold>,
  ) {}

  async findAll(user: AuthenticatedUser) {
    if (user.role === Role.STUDENT) {
      const student = await this.studentsRepo.findOne({ where: { userId: user.id } });
      if (!student) throw new NotFoundException('Student profile not found for this account');
      const hold = await this.financialHoldsRepo.findOne({ where: { studentId: student.id, active: true } });
      if (hold) throw new ForbiddenException('A financial hold blocks transcript access. Contact the finance office.');
      const enrollments = await this.enrollmentsRepo.find({
        where: { studentId: student.id, status: 'approved' },
        select: { id: true },
      });
      return enrollments.length
        ? this.repo.find({
            where: {
              enrollmentId: In(enrollments.map(({ id }) => id)),
              approvalStatus: In(['submitted', 'approved']),
            },
            order: { submittedAt: 'DESC', id: 'DESC' },
          })
        : [];
    }

    if (user.role === Role.TEACHER) {
      const sectionIds = await this.teacherSectionIds(user.id);
      return sectionIds.length ? this.findForSections(sectionIds) : [];
    }

    if (user.role === Role.DEPT_HEAD) {
      const department = await this.departmentsRepo.findOne({ where: { headUserId: user.id } });
      if (!department) return [];
      const students = await this.studentsRepo.find({
        where: { departmentId: department.id },
        select: { id: true },
      });
      const studentIds = students.map(({ id }) => id);
      const enrollments = studentIds.length
        ? await this.enrollmentsRepo.find({
            where: { studentId: In(studentIds) },
            select: { id: true },
          })
        : [];
      return enrollments.length
        ? this.repo.find({ where: { enrollmentId: In(enrollments.map(({ id }) => id)) }, order: { id: 'ASC' } })
        : [];
    }

    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const grade = await this.repo.findOne({ where: { id } });
    if (!grade) throw new NotFoundException(`Grade #${id} not found`);
    await this.assertCanAccess(grade, user);
    if (user.role === Role.STUDENT && grade.approvalStatus !== 'approved') {
      throw new NotFoundException(`Grade #${id} not found`);
    }
    return grade;
  }

  async create(data: Partial<Grade>, user: AuthenticatedUser) {
    if (!data.enrollmentId) throw new BadRequestException('An enrollment is required.');
    const enrollment = await this.enrollmentsRepo.findOne({
      where: { id: data.enrollmentId, status: 'approved' },
    });
    if (!enrollment) throw new NotFoundException('Approved enrollment not found.');
    const existing = await this.repo.findOne({ where: { enrollmentId: enrollment.id } });
    if (existing) throw new BadRequestException('A grade already exists for this enrollment.');
    if (user.role === Role.TEACHER) await this.assertTeacherOwnsEnrollment(user.id, enrollment);
    if (user.role !== Role.TEACHER && user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException();
    }

    return this.repo.save(this.repo.create({
      enrollmentId: enrollment.id,
      midtermScore: data.midtermScore ?? 0,
      finalScore: data.finalScore ?? 0,
      assignmentScore: data.assignmentScore ?? 0,
      totalScore: data.totalScore ?? 0,
      letterGrade: data.letterGrade,
      gradePoint: data.gradePoint,
      enteredBy: user.id,
      approvalStatus: 'draft',
    }));
  }

  async update(id: number, data: Partial<Grade>, user: AuthenticatedUser) {
    const grade = await this.findOne(id, user);
    if (grade.approvalStatus === 'submitted' || grade.approvalStatus === 'approved') {
      throw new BadRequestException('Submitted grades cannot be edited. Wait for department review.');
    }
    const fields: (keyof Grade)[] = [
      'midtermScore', 'finalScore', 'assignmentScore', 'totalScore', 'letterGrade', 'gradePoint',
    ];
    const patch: Partial<Grade> = {};
    for (const field of fields) {
      if (data[field] !== undefined) Object.assign(patch, { [field]: data[field] });
    }
    patch.approvalStatus = 'draft';
    patch.submittedAt = null;
    await this.repo.update(id, patch);
    return this.findOne(id, user);
  }

  async submit(id: number, user: AuthenticatedUser) {
    if (user.role !== Role.TEACHER) throw new ForbiddenException();
    const grade = await this.findOne(id, user);
    if (grade.approvalStatus !== 'draft' && grade.approvalStatus !== 'rejected') {
      throw new BadRequestException('Only draft or rejected grades can be submitted.');
    }
    await this.repo.update(id, { approvalStatus: 'submitted', submittedAt: new Date() });
    return this.findOne(id, user);
  }

  async approve(id: number, approved: boolean, user: AuthenticatedUser) {
    if (user.role !== Role.DEPT_HEAD) throw new ForbiddenException();
    const grade = await this.repo.findOne({ where: { id } });
    if (!grade) throw new NotFoundException(`Grade #${id} not found`);
    await this.assertDepartmentOwnsGrade(grade, user.id);
    if (grade.approvalStatus !== 'submitted') {
      throw new BadRequestException('Only submitted grades can be reviewed.');
    }
    await this.repo.update(id, {
      approvalStatus: approved ? 'approved' : 'rejected',
      approvedBy: approved ? user.id : null,
      approvedAt: approved ? new Date() : null,
    });
    return this.repo.findOneByOrFail({ id });
  }

  private async findForSections(sectionIds: number[]) {
    const enrollments = await this.enrollmentsRepo.find({
      where: { courseSectionId: In(sectionIds) },
      select: { id: true },
    });
    return enrollments.length
      ? this.repo.find({ where: { enrollmentId: In(enrollments.map(({ id }) => id)) }, order: { id: 'ASC' } })
      : [];
  }

  private async teacherSectionIds(userId: number) {
    const teacher = await this.teachersRepo.findOne({ where: { userId } });
    if (!teacher) throw new NotFoundException('Teacher profile not found for this account');
    const sections = await this.sectionsRepo.find({
      where: { teacherId: teacher.id },
      select: { id: true },
    });
    return sections.map(({ id }) => id);
  }

  private async assertCanAccess(grade: Grade, user: AuthenticatedUser) {
    const enrollment = await this.enrollmentsRepo.findOne({ where: { id: grade.enrollmentId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found.');
    if (user.role === Role.TEACHER) await this.assertTeacherOwnsEnrollment(user.id, enrollment);
    if (user.role === Role.STUDENT) {
      const student = await this.studentsRepo.findOne({ where: { userId: user.id } });
      if (!student) throw new NotFoundException('Student profile not found for this account');
      const hold = await this.financialHoldsRepo.findOne({ where: { studentId: student.id, active: true } });
      if (hold) throw new ForbiddenException('A financial hold blocks transcript access. Contact the finance office.');
      if (enrollment.studentId !== student.id) throw new ForbiddenException();
    }
    if (user.role === Role.DEPT_HEAD) await this.assertDepartmentOwnsGrade(grade, user.id);
  }

  private async assertTeacherOwnsEnrollment(userId: number, enrollment: Enrollment) {
    const teacher = await this.teachersRepo.findOne({ where: { userId } });
    if (!teacher) throw new NotFoundException('Teacher profile not found for this account');
    const section = await this.sectionsRepo.findOne({
      where: { id: enrollment.courseSectionId, teacherId: teacher.id },
    });
    if (!section) throw new ForbiddenException();
  }

  private async assertDepartmentOwnsGrade(grade: Grade, userId: number) {
    const department = await this.departmentsRepo.findOne({ where: { headUserId: userId } });
    if (!department) throw new ForbiddenException('No department is assigned to this account.');
    const enrollment = await this.enrollmentsRepo.findOne({ where: { id: grade.enrollmentId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found.');
    const student = await this.studentsRepo.findOne({ where: { id: enrollment.studentId } });
    if (!student || student.departmentId !== department.id) throw new ForbiddenException();
  }
}
