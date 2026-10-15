import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../../common/constants/roles.enum';
import { Semester } from '../semesters/entities/semester.entity';
import { Department } from '../departments/entities/department.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { CourseSection } from '../course-sections/entities/course-section.entity';
import { FinancialHold } from '../financial-holds/entities/financial-hold.entity';
import { Enrollment } from './entities/enrollment.entity';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly repo: Repository<Enrollment>,
    @InjectRepository(Student)
    private readonly studentsRepo: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teachersRepo: Repository<Teacher>,
    @InjectRepository(CourseSection)
    private readonly sectionsRepo: Repository<CourseSection>,
    @InjectRepository(FinancialHold)
    private readonly financialHoldsRepo: Repository<FinancialHold>,
    @InjectRepository(Semester)
    private readonly semestersRepo: Repository<Semester>,
    @InjectRepository(Department)
    private readonly departmentsRepo: Repository<Department>,
  ) {}

  async findAll(user: AuthenticatedUser) {
    if (user.role === Role.STUDENT) {
      const student = await this.studentsRepo.findOne({ where: { userId: user.id } });
      if (!student) throw new NotFoundException('Student profile not found for this account');
      return this.repo.find({ where: { studentId: student.id }, order: { id: 'ASC' } });
    }
    if (user.role === Role.TEACHER) {
      const teacher = await this.teachersRepo.findOne({ where: { userId: user.id } });
      if (!teacher) throw new NotFoundException('Teacher profile not found for this account');
      const sections = await this.sectionsRepo.find({ where: { teacherId: teacher.id } });
      const sectionIds = sections.map(({ id }) => id);
      return sectionIds.length
        ? this.repo.find({ where: { courseSectionId: In(sectionIds) }, order: { id: 'ASC' } })
        : [];
    }
    if (user.role === Role.DEPT_HEAD) {
      const department = await this.departmentsRepo.findOne({ where: { headUserId: user.id } });
      if (!department) return [];
      const students = await this.studentsRepo.find({ where: { departmentId: department.id }, select: { id: true } });
      const studentIds = students.map(({ id }) => id);
      return studentIds.length
        ? this.repo.find({ where: { studentId: In(studentIds) }, order: { id: 'ASC' } })
        : [];
    }
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException(`Enrollment #${id} not found`);
    await this.assertCanAccess(e, user);
    return e;
  }

  async create(data: Partial<Enrollment>, user: AuthenticatedUser) {
    if (user.role === Role.STUDENT) {
      if (!data.courseSectionId) throw new BadRequestException('Select a course section.');
      const student = await this.studentsRepo.findOne({ where: { userId: user.id } });
      if (!student) throw new NotFoundException('Student profile not found for this account');
      if (student.status !== 'active') throw new BadRequestException('Only active students may enroll.');
      const financialHold = await this.financialHoldsRepo.findOne({ where: { studentId: student.id, active: true } });
      if (financialHold) throw new BadRequestException('Your account has a financial hold. Contact the finance office before enrolling.');
      const section = await this.sectionsRepo.findOne({ where: { id: data.courseSectionId } });
      if (!section) throw new NotFoundException(`Course section #${data.courseSectionId} not found`);
      if (section.status !== 'open') throw new BadRequestException('This course section is not open for enrollment.');
      const semester = await this.semestersRepo.findOne({ where: { id: section.semesterId } });
      if (!semester?.enrollmentOpen) throw new BadRequestException('Enrollment is closed for this term.');
      if (section.enrolledCount >= section.capacity) throw new BadRequestException('This course section is full.');
      const existing = await this.repo.findOne({
        where: {
          studentId: student.id,
          courseSectionId: section.id,
          status: In(['pending', 'approved']),
        },
      });
      if (existing) throw new ConflictException('You already have an active enrollment for this course section.');
      return this.repo.save(this.repo.create({
        studentId: student.id,
        courseSectionId: section.id,
        semesterId: section.semesterId,
        status: 'pending',
      }));
    }
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Enrollment>, user: AuthenticatedUser) {
    const enrollment = await this.findOne(id, user);
    const nextStatus = data.status ?? enrollment.status;
    if (user.role === Role.STUDENT && nextStatus !== 'dropped') {
      throw new ForbiddenException('Students may only drop their own enrollment.');
    }
    if (nextStatus === 'approved' && enrollment.status !== 'approved') {
      await this.repo.manager.transaction(async (manager) => {
        const section = await manager.findOne(CourseSection, {
          where: { id: enrollment.courseSectionId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!section) throw new NotFoundException(`Course section #${enrollment.courseSectionId} not found`);
        if (section.status !== 'open' || section.enrolledCount >= section.capacity) {
          throw new BadRequestException('The section is closed or full.');
        }
        await manager.update(CourseSection, section.id, { enrolledCount: section.enrolledCount + 1 });
        await manager.update(Enrollment, id, {
          status: nextStatus,
          approvedBy: user.id,
          approvedAt: new Date(),
        });
      });
    } else if (enrollment.status === 'approved' && nextStatus !== 'approved') {
      await this.repo.manager.transaction(async (manager) => {
        const section = await manager.findOne(CourseSection, {
          where: { id: enrollment.courseSectionId },
          lock: { mode: 'pessimistic_write' },
        });
        if (section) await manager.update(CourseSection, section.id, { enrolledCount: Math.max(0, section.enrolledCount - 1) });
        await manager.update(Enrollment, id, { status: nextStatus });
      });
    } else {
      await this.repo.update(id, {
        status: nextStatus,
        approvedBy: nextStatus === 'approved' ? (data.approvedBy ?? user.id) : enrollment.approvedBy,
        approvedAt: nextStatus === 'approved' ? (data.approvedAt ?? new Date()) : enrollment.approvedAt,
      });
    }
    return this.findOne(id, user);
  }

  async remove(id: number, user: AuthenticatedUser) {
    const enrollment = await this.findOne(id, user);
    await this.repo.manager.transaction(async (manager) => {
      if (enrollment.status === 'approved') {
        const section = await manager.findOne(CourseSection, {
          where: { id: enrollment.courseSectionId },
          lock: { mode: 'pessimistic_write' },
        });
        if (section) {
          await manager.update(CourseSection, section.id, {
            enrolledCount: Math.max(0, section.enrolledCount - 1),
          });
        }
      }
      await manager.delete(Enrollment, id);
    });
    return { message: `Enrollment #${id} deleted` };
  }

  private async assertCanAccess(enrollment: Enrollment, user: AuthenticatedUser) {
    if (user.role === Role.STUDENT) {
      const student = await this.studentsRepo.findOne({ where: { userId: user.id } });
      if (!student) throw new NotFoundException('Student profile not found for this account');
      if (enrollment.studentId !== student.id) throw new ForbiddenException();
    } else if (user.role === Role.TEACHER) {
      const teacher = await this.teachersRepo.findOne({ where: { userId: user.id } });
      if (!teacher) throw new NotFoundException('Teacher profile not found for this account');
      const section = await this.sectionsRepo.findOne({
        where: { id: enrollment.courseSectionId, teacherId: teacher.id },
      });
      if (!section) throw new ForbiddenException();
    } else if (user.role === Role.DEPT_HEAD) {
      const department = await this.departmentsRepo.findOne({ where: { headUserId: user.id } });
      if (!department) throw new ForbiddenException('No department is assigned to this account.');
      const student = await this.studentsRepo.findOne({ where: { id: enrollment.studentId } });
      if (!student || student.departmentId !== department.id) throw new ForbiddenException();
    }
  }
}