import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { totalmem } from 'os';

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
import { Assignment } from '../assignments/entities/assignment.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Grade } from '../grades/entities/grade.entity';

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
    @InjectRepository(Assignment) private assignmentsRepo: Repository<Assignment>,
    @InjectRepository(Attendance) private attendanceRepo: Repository<Attendance>,
    @InjectRepository(Grade) private gradesRepo: Repository<Grade>,
  ) {}

  // ========== SUPER ADMIN ==========
  async superAdminStats() {
    const [
      activeUsers,
      totalUsers,
      totalStudents,
      totalTeachers,
      totalDepartments,
      totalCourses,
      totalSections,
      totalEnrollments,
      totalAnnouncements,
    ] = await Promise.all([
      this.usersRepo.count({ where: { status: 'active' } }),
      this.usersRepo.count(),
      this.studentsRepo.count(),
      this.teachersRepo.count(),
      this.departmentsRepo.count(),
      this.coursesRepo.count(),
      this.sectionsRepo.count(),
      this.enrollmentsRepo.count(),
      this.announcementsRepo.count(),
    ]);
    const [databaseSize] = await this.usersRepo.query(
      'SELECT COALESCE(SUM(data_length + index_length), 0) AS bytes FROM information_schema.tables WHERE table_schema = DATABASE()',
    );
    const memory = process.memoryUsage();
    const systemMemoryTotal = totalmem();

    return {
      role: 'super_admin',
      stats: {
        activeUsers,
        totalUsers,
        totalStudents,
        totalTeachers,
        totalDepartments,
        totalCourses,
        totalSections,
        totalEnrollments,
        totalAnnouncements,
        serverMemoryUsedMb: Math.round(memory.rss / 1024 / 1024),
        serverMemoryTotalMb: Math.round(systemMemoryTotal / 1024 / 1024),
        serverLoadPercent: Math.round((memory.rss / systemMemoryTotal) * 100),
        databaseStorageMb: Number((Number(databaseSize?.bytes || 0) / 1024 / 1024).toFixed(2)),
        serverUptimeSeconds: Math.floor(process.uptime()),
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
      return {
        role: 'teacher',
        stats: { totalSections: 0, totalStudents: 0, totalAssignments: 0, attendanceRate: '—' },
        sections: [],
      };
    }

    const sections = await this.sectionsRepo.find({
      where: { teacherId: teacher.id },
    });
    const sectionIds = sections.map(({ id }) => id);
    let enrollments: Enrollment[] = [];
    let totalAssignments = 0;
    let attendance: Attendance[] = [];
    if (sectionIds.length) {
      [enrollments, totalAssignments, attendance] = await Promise.all([
        this.enrollmentsRepo.find({
          where: { courseSectionId: In(sectionIds), status: 'approved' },
          select: { studentId: true },
        }),
        this.assignmentsRepo.count({ where: { courseSectionId: In(sectionIds) } }),
        this.attendanceRepo.find({
          where: { courseSectionId: In(sectionIds) },
          select: { status: true },
        }),
      ]);
    }

    const attendanceCounted = attendance.filter(({ status }) => status !== 'excused');
    const attendedCount = attendanceCounted.filter(
      ({ status }) => status === 'present' || status === 'late',
    ).length;
    const attendanceRate = attendanceCounted.length
      ? `${Math.round((attendedCount / attendanceCounted.length) * 100)}%`
      : '—';

    return {
      role: 'teacher',
      stats: {
        totalSections: sections.length,
        totalStudents: new Set(enrollments.map(({ studentId }) => studentId)).size,
        totalAssignments,
        attendanceRate,
      },
      sections,
    };
  }

  // ========== STUDENT ==========
  async studentStats(userId: number) {
    const student = await this.studentsRepo.findOne({ where: { userId } });
    if (!student) {
      return {
        role: 'student',
        stats: { totalEnrollments: 0, outstandingBalance: 0, recentAnnouncements: 0, cumulativeGpa: 0, completedCredits: 0 },
        enrollments: [],
        invoices: [],
        recentAnnouncements: [],
      };
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
      (sum, inv) => sum + (inv.status === 'cancelled' ? 0 : Number(inv.totalDue) - Number(inv.amountPaid)),
      0,
    );
    const enrollmentIds = enrollments.map(({ id }) => id);
    const grades = enrollmentIds.length
      ? await this.gradesRepo.find({
          where: { enrollmentId: In(enrollmentIds), approvalStatus: 'approved' },
        })
      : [];
    const enrollmentById = new Map(enrollments.map((enrollment) => [enrollment.id, enrollment]));
    const sectionIds = [...new Set(enrollments.map(({ courseSectionId }) => courseSectionId))];
    const sections = sectionIds.length
      ? await this.sectionsRepo.find({ where: { id: In(sectionIds) } })
      : [];
    const sectionById = new Map(sections.map((section) => [section.id, section]));
    const courseIds = [...new Set(sections.map(({ courseId }) => courseId))];
    const courses = courseIds.length
      ? await this.coursesRepo.find({ where: { id: In(courseIds) } })
      : [];
    const courseById = new Map(courses.map((course) => [course.id, course]));
    const weightedGrades = grades.reduce((result, grade) => {
      const enrollment = enrollmentById.get(grade.enrollmentId);
      const section = enrollment ? sectionById.get(enrollment.courseSectionId) : undefined;
      const course = section ? courseById.get(section.courseId) : undefined;
      const credits = Number(course?.creditHours ?? 0);
      if (credits > 0 && grade.gradePoint !== null) {
        result.points += Number(grade.gradePoint) * credits;
        result.credits += credits;
      }
      return result;
    }, { points: 0, credits: 0 });
    const completedCredits = enrollments
      .filter(({ status }) => status === 'completed')
      .reduce((credits, enrollment) => {
        const section = sectionById.get(enrollment.courseSectionId);
        const course = section ? courseById.get(section.courseId) : undefined;
        return credits + Number(course?.creditHours ?? 0);
      }, 0);

    return {
      role: 'student',
      stats: {
        totalEnrollments: enrollments.length,
        outstandingBalance: outstanding,
        recentAnnouncements: announcements.length,
        cumulativeGpa: weightedGrades.credits
          ? Number((weightedGrades.points / weightedGrades.credits).toFixed(2))
          : 0,
        completedCredits,
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

    const [teachers, students, courses, sections] = await Promise.all([
      this.teachersRepo.count({ where: { departmentId: department.id } }),
      this.studentsRepo.count({ where: { departmentId: department.id } }),
      this.coursesRepo.count({ where: { departmentId: department.id } }),
      this.sectionsRepo
        .createQueryBuilder('section')
        .innerJoin('courses', 'course', 'course.id = section.course_id')
        .where('course.department_id = :departmentId', { departmentId: department.id })
        .getCount(),
    ]);

    return {
      role: 'dept_head',
      department,
      stats: { teachers, students, courses, sections },
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