import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../../common/constants/roles.enum';
import { Course } from '../courses/entities/course.entity';
import { Department } from '../departments/entities/department.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { CourseSection } from './entities/course-section.entity';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

@Injectable()
export class CourseSectionsService {
  constructor(
    @InjectRepository(CourseSection) private readonly repo: Repository<CourseSection>,
    @InjectRepository(Teacher) private readonly teachersRepo: Repository<Teacher>,
    @InjectRepository(Course) private readonly coursesRepo: Repository<Course>,
    @InjectRepository(Department) private readonly departmentsRepo: Repository<Department>,
  ) {}

  async findAll(user: AuthenticatedUser) {
    if (user.role === Role.STUDENT) {
      return this.repo.find({
        where: { status: 'open', offeringStatus: 'approved' },
        order: { id: 'ASC' },
      });
    }
    if (user.role === Role.TEACHER) {
      const teacher = await this.teachersRepo.findOne({ where: { userId: user.id } });
      if (!teacher) throw new NotFoundException('Teacher profile not found for this account');
      return this.repo.find({ where: { teacherId: teacher.id }, order: { id: 'ASC' } });
    }
    if (user.role === Role.DEPT_HEAD) {
      const courseIds = await this.departmentCourseIds(user.id);
      return courseIds.length
        ? this.repo.find({ where: { courseId: In(courseIds) }, order: { id: 'ASC' } })
        : [];
    }
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const section = await this.repo.findOne({ where: { id } });
    if (!section) throw new NotFoundException(`CourseSection #${id} not found`);
    if (user.role === Role.STUDENT && (section.status !== 'open' || section.offeringStatus !== 'approved')) {
      throw new ForbiddenException();
    }
    if (user.role === Role.TEACHER) await this.assertTeacherOwnsSection(user.id, section);
    if (user.role === Role.DEPT_HEAD) await this.assertDepartmentOwnsSection(user.id, section);
    return section;
  }

  async create(data: Partial<CourseSection>, user: AuthenticatedUser) {
    if (user.role === Role.DEPT_HEAD) {
      const departmentCourseIds = await this.departmentCourseIds(user.id);
      if (!data.courseId || !departmentCourseIds.includes(data.courseId)) throw new ForbiddenException();
    }
    if (data.teacherId) await this.assertTeacherBelongsToCourse(data.teacherId, data.courseId);
    return this.repo.save(this.repo.create({ ...data, offeringStatus: 'submitted' }));
  }

  async update(id: number, data: Partial<CourseSection>, user: AuthenticatedUser) {
    const existing = await this.findOne(id, user);
    if (user.role === Role.DEPT_HEAD && data.courseId && data.courseId !== existing.courseId) {
      throw new BadRequestException('Department heads cannot move an offering to another course.');
    }
    const teacherId = data.teacherId === undefined ? existing.teacherId : data.teacherId;
    if (teacherId) await this.assertTeacherBelongsToCourse(teacherId, existing.courseId);
    const { offeringStatus: _offeringStatus, ...editableData } = data;
    await this.repo.update(id, editableData);
    return this.repo.findOneByOrFail({ id });
  }

  async reviewOffering(id: number, approved: boolean, userId: number) {
    const section = await this.repo.findOne({ where: { id } });
    if (!section) throw new NotFoundException(`CourseSection #${id} not found`);
    await this.assertDepartmentOwnsSection(userId, section);
    if (section.offeringStatus !== 'submitted') {
      throw new BadRequestException('Only submitted course offerings can be reviewed.');
    }
    await this.repo.update(id, { offeringStatus: approved ? 'approved' : 'rejected' });
    return this.repo.findOneByOrFail({ id });
  }

  async remove(id: number, user: AuthenticatedUser) {
    await this.findOne(id, user);
    await this.repo.delete(id);
    return { message: `CourseSection #${id} deleted` };
  }

  private async departmentCourseIds(userId: number) {
    const department = await this.departmentsRepo.findOne({ where: { headUserId: userId } });
    if (!department) return [];
    const courses = await this.coursesRepo.find({
      where: { departmentId: department.id },
      select: { id: true },
    });
    return courses.map(({ id }) => id);
  }

  private async assertDepartmentOwnsSection(userId: number, section: CourseSection) {
    const departmentCourseIds = await this.departmentCourseIds(userId);
    if (!departmentCourseIds.includes(section.courseId)) throw new ForbiddenException();
  }

  private async assertTeacherOwnsSection(userId: number, section: CourseSection) {
    const teacher = await this.teachersRepo.findOne({ where: { userId } });
    if (!teacher) throw new NotFoundException('Teacher profile not found for this account');
    if (section.teacherId !== teacher.id) throw new ForbiddenException();
  }

  private async assertTeacherBelongsToCourse(teacherId: number, courseId?: number) {
    if (!courseId) throw new BadRequestException('A course is required before assigning a teacher.');
    const [teacher, course] = await Promise.all([
      this.teachersRepo.findOne({ where: { id: teacherId } }),
      this.coursesRepo.findOne({ where: { id: courseId } }),
    ]);
    if (!teacher) throw new NotFoundException(`Teacher #${teacherId} not found`);
    if (!course) throw new NotFoundException(`Course #${courseId} not found`);
    if (teacher.departmentId !== course.departmentId) {
      throw new BadRequestException('The teacher must belong to the course department.');
    }
  }
}
