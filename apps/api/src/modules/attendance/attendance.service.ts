import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../../common/constants/roles.enum';
import { CourseSection } from '../course-sections/entities/course-section.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Attendance } from './entities/attendance.entity';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

interface AttendanceInput {
  courseSectionId: number;
  studentId: number;
  attendanceDate: string;
  status: Attendance['status'];
  remarks?: string;
}

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance) private readonly repo: Repository<Attendance>,
    @InjectRepository(CourseSection) private readonly sectionsRepo: Repository<CourseSection>,
    @InjectRepository(Enrollment) private readonly enrollmentsRepo: Repository<Enrollment>,
    @InjectRepository(Student) private readonly studentsRepo: Repository<Student>,
    @InjectRepository(Teacher) private readonly teachersRepo: Repository<Teacher>,
  ) {}

  async findAll(user: AuthenticatedUser) {
    if (user.role === Role.STUDENT) {
      const student = await this.studentsRepo.findOne({ where: { userId: user.id } });
      if (!student) throw new NotFoundException('Student profile not found for this account');
      return this.repo.find({ where: { studentId: student.id }, order: { attendanceDate: 'DESC' } });
    }
    if (user.role === Role.TEACHER) {
      const teacher = await this.teachersRepo.findOne({ where: { userId: user.id } });
      if (!teacher) throw new NotFoundException('Teacher profile not found for this account');
      const sections = await this.sectionsRepo.find({ where: { teacherId: teacher.id }, select: { id: true } });
      const sectionIds = sections.map(({ id }) => id);
      return sectionIds.length
        ? this.repo.find({ where: { courseSectionId: In(sectionIds) }, order: { attendanceDate: 'DESC' } })
        : [];
    }
    return this.repo.find({ order: { attendanceDate: 'DESC' } });
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const attendance = await this.repo.findOne({ where: { id } });
    if (!attendance) throw new NotFoundException(`Attendance #${id} not found`);
    await this.assertCanAccess(attendance, user);
    return attendance;
  }

  async create(data: AttendanceInput, user: AuthenticatedUser) {
    if (!data.courseSectionId || !data.studentId || !this.isValidDate(data.attendanceDate)) {
      throw new BadRequestException('A valid section, student, and attendance date are required.');
    }
    this.validateStatus(data.status);
    await this.assertCanMark(data.courseSectionId, data.studentId, user);

    const attendanceDate = new Date(`${data.attendanceDate}T00:00:00.000Z`);
    const existing = await this.repo.findOne({
      where: { courseSectionId: data.courseSectionId, studentId: data.studentId, attendanceDate },
    });
    if (existing) {
      existing.status = data.status;
      existing.remarks = data.remarks ?? existing.remarks;
      existing.markedBy = user.id;
      return this.repo.save(existing);
    }

    return this.repo.save(this.repo.create({
      courseSectionId: data.courseSectionId,
      studentId: data.studentId,
      attendanceDate,
      status: data.status,
      remarks: data.remarks,
      markedBy: user.id,
    }));
  }

  async update(id: number, data: Partial<AttendanceInput>, user: AuthenticatedUser) {
    const attendance = await this.findOne(id, user);
    await this.assertCanMark(attendance.courseSectionId, attendance.studentId, user);
    if (data.status !== undefined) {
      this.validateStatus(data.status);
      attendance.status = data.status;
    }
    if (data.remarks !== undefined) attendance.remarks = data.remarks;
    attendance.markedBy = user.id;
    return this.repo.save(attendance);
  }

  async remove(id: number, user: AuthenticatedUser) {
    await this.findOne(id, user);
    await this.repo.delete(id);
    return { message: `Attendance #${id} deleted` };
  }

  private async assertCanAccess(attendance: Attendance, user: AuthenticatedUser) {
    if (user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN) return;
    if (user.role === Role.STUDENT) {
      const student = await this.studentsRepo.findOne({ where: { userId: user.id } });
      if (!student) throw new NotFoundException('Student profile not found for this account');
      if (attendance.studentId !== student.id) throw new ForbiddenException();
      return;
    }
    await this.assertCanMark(attendance.courseSectionId, attendance.studentId, user);
  }

  private async assertCanMark(courseSectionId: number, studentId: number, user: AuthenticatedUser) {
    const section = await this.sectionsRepo.findOne({ where: { id: courseSectionId } });
    if (!section) throw new NotFoundException(`Course section #${courseSectionId} not found`);
    if (user.role === Role.TEACHER) {
      const teacher = await this.teachersRepo.findOne({ where: { userId: user.id } });
      if (!teacher) throw new NotFoundException('Teacher profile not found for this account');
      if (section.teacherId !== teacher.id) throw new ForbiddenException('You may only mark attendance for assigned sections.');
    } else if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException();
    }

    const enrollment = await this.enrollmentsRepo.findOne({
      where: { courseSectionId, studentId, status: 'approved' },
    });
    if (!enrollment) throw new BadRequestException('Attendance can only be recorded for an approved student in this section.');
  }

  private isValidDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  private validateStatus(status: Attendance['status']) {
    if (!['present', 'absent', 'late', 'excused'].includes(status)) {
      throw new BadRequestException('Attendance status must be present, absent, late, or excused.');
    }
  }
}
