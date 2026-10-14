import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Department } from '../departments/entities/department.entity';
import { Course } from '../courses/entities/course.entity';
import { CourseSection } from '../course-sections/entities/course-section.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Announcement } from '../announcements/entities/announcement.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Student) private studentsRepo: Repository<Student>,
    @InjectRepository(Teacher) private teachersRepo: Repository<Teacher>,
    @InjectRepository(Department) private departmentsRepo: Repository<Department>,
    @InjectRepository(Course) private coursesRepo: Repository<Course>,
    @InjectRepository(CourseSection) private sectionsRepo: Repository<CourseSection>,
    @InjectRepository(Enrollment) private enrollmentsRepo: Repository<Enrollment>,
    @InjectRepository(Invoice) private invoicesRepo: Repository<Invoice>,
    @InjectRepository(Payment) private paymentsRepo: Repository<Payment>,
    @InjectRepository(Announcement) private announcementsRepo: Repository<Announcement>,
  ) {}

  // ========== SUPER ADMIN ==========
  async superAdminStats() {
    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalDepartments,
      totalCourses,
      totalSections,
      totalEnrollments,
      totalAnnouncements,
    ] = await Promise.all([
      this.usersRepo.count(),
      this.studentsRepo.count(),
      this.teachersRepo.count(),
      this.departmentsRepo.count(),
      this.coursesRepo.count(),
      this.sectionsRepo.count(),
      this.enrollmentsRepo.count(),
      this.announcementsRepo.count(),
    ]);

    return {
      role: 'super_admin',
      stats: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalDepartments,
        totalCourses,
        totalSections,
        totalEnrollments,
        totalAnnouncements,
      },
    };
  }

  // ========== ADMIN ==========
  async adminStats() {
    const [totalStudents, totalTeachers, totalCourses, totalSections, pendingEnrollments] =
      await Promise.all([
        this.studentsRepo.count(),
        this.teachersRepo.count(),
        this.coursesRepo.count(),
        this.sectionsRepo.count(),
        this.enrollmentsRepo.count({ where: { status: 'pending' } }),
      ]);

    const recentEnrollments = await this.enrollmentsRepo.find({
      order: { id: 'DESC' },
      take: 10,
    });

    return {
      role: 'admin',
      stats: {
        totalStudents,
        totalTeachers,
        totalCourses,
        totalSections,
        pendingEnrollments,
      },
      recentEnrollments,
    };
  }

  // ========== TEACHER ==========
  async teacherStats(userId: number) {
    const teacher = await this.teachersRepo.findOne({ where: { userId } });
    if (!teacher) {
      return { role: 'teacher', stats: { totalSections: 0, totalStudents: 0, totalAssignments: 0, avgAttendance: 0 }, sections: [] };
    }

    const sections = await this.sectionsRepo.find({
      where: { teacherId: teacher.id },
    });

    return {
      role: 'teacher',
      stats: {
        totalSections: sections.length,
        totalStudents: sections.reduce((sum, s) => sum + (s.enrolledCount || 0), 0),
        totalAssignments: 0,
        avgAttendance: 0,
      },
      sections,
    };
  }

  // ========== STUDENT ==========
  async studentStats(userId: number) {
    const student = await this.studentsRepo.findOne({ where: { userId } });
    if (!student) {
      return { role: 'student', stats: {}, enrollments: [], invoices: [], recentAnnouncements: [] };
    }

    const [enrollments, invoices, announcements] = await Promise.all([
      this.enrollmentsRepo.find({
        where: { studentId: student.id },
        order: { id: 'DESC' },
      }),
      this.invoicesRepo.find({
        where: { studentId: student.id },
        order: { id: 'DESC' },
        take: 5,
      }),
      this.announcementsRepo.find({ order: { id: 'DESC' }, take: 5 }),
    ]);

    const outstanding = invoices.reduce(
      (sum, inv) => sum + Number(inv.totalDue) - Number(inv.amountPaid),
      0,
    );

    return {
      role: 'student',
      stats: {
        totalEnrollments: enrollments.length,
        outstandingBalance: outstanding,
      },
      enrollments,
      invoices,
      recentAnnouncements: announcements,
    };
  }

  // ========== ACCOUNTANT ==========
  async accountantStats() {
    const [totalInvoices, totalPayments] = await Promise.all([
      this.invoicesRepo.count(),
      this.paymentsRepo.count(),
    ]);

    const invoices = await this.invoicesRepo.find();
    const totalBilled = invoices.reduce((s, i) => s + Number(i.totalDue), 0);
    const totalCollected = invoices.reduce((s, i) => s + Number(i.amountPaid), 0);

    const recentPayments = await this.paymentsRepo.find({
      order: { id: 'DESC' },
      take: 10,
    });

    return {
      role: 'accountant',
      stats: {
        totalInvoices,
        totalPayments,
        totalBilled,
        totalCollected,
        outstanding: totalBilled - totalCollected,
      },
      recentPayments,
    };
  }

  // ========== DEPT HEAD ==========
  async deptHeadStats(userId: number) {
    const department = await this.departmentsRepo.findOne({
      where: { headUserId: userId },
    });
    if (!department) {
      return { role: 'dept_head', stats: {}, department: null };
    }

    const [teachers, students, courses] = await Promise.all([
      this.teachersRepo.count({ where: { departmentId: department.id } }),
      this.studentsRepo.count({ where: { departmentId: department.id } }),
      this.coursesRepo.count({ where: { departmentId: department.id } }),
    ]);

    return {
      role: 'dept_head',
      department,
      stats: { teachers, students, courses },
    };
  }

  // ========== ROUTER (by role) ==========
  async statsForRole(userId: number, role: string) {
    switch (role) {
      case 'super_admin':
        return this.superAdminStats();
      case 'admin':
        return this.adminStats();
      case 'teacher':
        return this.teacherStats(userId);
      case 'student':
        return this.studentStats(userId);
      case 'accountant':
        return this.accountantStats();
      case 'dept_head':
        return this.deptHeadStats(userId);
      default:
        return { error: 'Unknown role' };
    }
  }
}