import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../../common/constants/roles.enum';
import { Student } from './entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { CourseSection } from '../course-sections/entities/course-section.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Department } from '../departments/entities/department.entity';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly repo: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teachersRepo: Repository<Teacher>,
    @InjectRepository(CourseSection)
    private readonly sectionsRepo: Repository<CourseSection>,
    @InjectRepository(Enrollment)
    private readonly enrollmentsRepo: Repository<Enrollment>,
    @InjectRepository(Department)
    private readonly departmentsRepo: Repository<Department>,
  ) {}

  async findAll(user: AuthenticatedUser) {
    if (user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN || user.role === Role.ACCOUNTANT) {
      return this.repo.find({ relations: ['user'], order: { id: 'ASC' } });
    }
    const studentIds = await this.visibleStudentIds(user);
    return studentIds.length
      ? this.repo.find({ where: { id: In(studentIds) }, relations: ['user'], order: { id: 'ASC' } })
      : [];
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const s = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!s) throw new NotFoundException(`Student #${id} not found`);
    if (user.role !== Role.SUPER_ADMIN && user.role !== Role.ADMIN && user.role !== Role.ACCOUNTANT) {
      const visibleIds = await this.visibleStudentIds(user);
      if (!visibleIds.includes(s.id)) throw new ForbiddenException();
    }
    return s;
  }

  async findByUserId(userId: number) {
    return this.repo.findOne({ where: { userId }, relations: ['user'] });
  }

  create(data: Partial<Student>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Student>) {
    const student = await this.repo.findOne({ where: { id } });
    if (!student) throw new NotFoundException(`Student #${id} not found`);
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id }, relations: ['user'] });
  }

  async remove(id: number) {
    const student = await this.repo.findOne({ where: { id } });
    if (!student) throw new NotFoundException(`Student #${id} not found`);
    await this.repo.delete(id);
    return { message: `Student #${id} deleted` };
  }

  private async visibleStudentIds(user: AuthenticatedUser): Promise<number[]> {
    if (user.role === Role.STUDENT) {
      const student = await this.repo.findOne({ where: { userId: user.id }, select: { id: true } });
      return student ? [student.id] : [];
    }
    if (user.role === Role.DEPT_HEAD) {
      const department = await this.departmentsRepo.findOne({ where: { headUserId: user.id } });
      if (!department) return [];
      const students = await this.repo.find({ where: { departmentId: department.id }, select: { id: true } });
      return students.map(({ id }) => id);
    }
    if (user.role === Role.TEACHER) {
      const teacher = await this.teachersRepo.findOne({ where: { userId: user.id } });
      if (!teacher) throw new NotFoundException('Teacher profile not found for this account');
      const sections = await this.sectionsRepo.find({ where: { teacherId: teacher.id }, select: { id: true } });
      const sectionIds = sections.map(({ id }) => id);
      if (!sectionIds.length) return [];
      const enrollments = await this.enrollmentsRepo.find({
        where: { courseSectionId: In(sectionIds), status: 'approved' },
        select: { studentId: true },
      });
      return [...new Set(enrollments.map(({ studentId }) => studentId))];
    }
    throw new ForbiddenException();
  }
}