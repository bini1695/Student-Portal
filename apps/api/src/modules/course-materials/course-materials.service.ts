import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../../common/constants/roles.enum';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { CourseSection } from '../course-sections/entities/course-section.entity';
import { CourseMaterial } from './entities/course-material.entity';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

@Injectable()
export class CourseMaterialsService {
  constructor(
    @InjectRepository(CourseMaterial)
    private readonly materialsRepo: Repository<CourseMaterial>,
    @InjectRepository(Enrollment)
    private readonly enrollmentsRepo: Repository<Enrollment>,
    @InjectRepository(Student)
    private readonly studentsRepo: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teachersRepo: Repository<Teacher>,
    @InjectRepository(CourseSection)
    private readonly sectionsRepo: Repository<CourseSection>,
  ) {}

  async findAll(user: AuthenticatedUser) {
    const sectionIds = await this.visibleSectionIds(user);
    if (sectionIds === null) return this.materialsRepo.find({ order: { uploadedAt: 'DESC' } });
    return sectionIds.length
      ? this.materialsRepo.find({
          where: { courseSectionId: In(sectionIds) },
          order: { uploadedAt: 'DESC' },
        })
      : [];
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const material = await this.materialsRepo.findOne({ where: { id } });
    if (!material) throw new NotFoundException(`Course material #${id} not found`);
    await this.assertCanAccess(material, user);
    return material;
  }

  async create(data: Partial<CourseMaterial>, user: AuthenticatedUser) {
    if (!data.courseSectionId) throw new BadRequestException('A course section is required.');
    if (!data.title?.trim()) throw new BadRequestException('A material title is required.');
    if (!data.filePath?.trim()) throw new BadRequestException('A file link is required.');
    if (user.role === Role.TEACHER) await this.assertTeacherOwnsSection(user.id, data.courseSectionId);
    return this.materialsRepo.save(this.materialsRepo.create({
      courseSectionId: data.courseSectionId,
      title: data.title.trim(),
      description: data.description,
      filePath: data.filePath,
      fileType: data.fileType,
      uploadedBy: user.id,
    }));
  }

  async update(id: number, data: Partial<CourseMaterial>, user: AuthenticatedUser) {
    const material = await this.findOne(id, user);
    if (data.title !== undefined && !data.title.trim()) throw new BadRequestException('Material title cannot be empty.');
    if (data.filePath !== undefined && !data.filePath.trim()) throw new BadRequestException('A file link is required.');
    if (data.courseSectionId && user.role === Role.TEACHER) {
      await this.assertTeacherOwnsSection(user.id, data.courseSectionId);
    }
    await this.materialsRepo.update(id, {
      courseSectionId: data.courseSectionId ?? material.courseSectionId,
      title: data.title ?? material.title,
      description: data.description ?? material.description,
      filePath: data.filePath ?? material.filePath,
      fileType: data.fileType ?? material.fileType,
    });
    return this.findOne(id, user);
  }

  async remove(id: number, user: AuthenticatedUser) {
    const material = await this.findOne(id, user);
    await this.materialsRepo.remove(material);
    return { message: `Course material #${id} deleted` };
  }

  private async visibleSectionIds(user: AuthenticatedUser): Promise<number[] | null> {
    if (user.role === Role.STUDENT) {
      const student = await this.studentsRepo.findOne({ where: { userId: user.id } });
      if (!student) throw new NotFoundException('Student profile not found for this account');
      const enrollments = await this.enrollmentsRepo.find({
        where: { studentId: student.id, status: 'approved' },
      });
      return [...new Set(enrollments.map(({ courseSectionId }) => courseSectionId))];
    }
    if (user.role === Role.TEACHER) {
      const teacher = await this.teachersRepo.findOne({ where: { userId: user.id } });
      if (!teacher) throw new NotFoundException('Teacher profile not found for this account');
      const sections = await this.sectionsRepo.find({ where: { teacherId: teacher.id } });
      return sections.map(({ id }) => id);
    }
    return null;
  }

  private async assertCanAccess(material: CourseMaterial, user: AuthenticatedUser) {
    if (user.role === Role.TEACHER) {
      await this.assertTeacherOwnsSection(user.id, material.courseSectionId);
    } else if (user.role === Role.STUDENT) {
      const sectionIds = await this.visibleSectionIds(user);
      if (!sectionIds?.includes(material.courseSectionId)) {
        throw new ForbiddenException('You are not enrolled in this course.');
      }
    }
  }

  private async assertTeacherOwnsSection(userId: number, sectionId: number) {
    const teacher = await this.teachersRepo.findOne({ where: { userId } });
    if (!teacher) throw new NotFoundException('Teacher profile not found for this account');
    const section = await this.sectionsRepo.findOne({
      where: { id: sectionId, teacherId: teacher.id },
    });
    if (!section) throw new ForbiddenException('You can only manage materials for your assigned sections.');
  }
}