import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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

import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Student,
      Teacher,
      Department,
      Course,
      CourseSection,
      Enrollment,
      Invoice,
      Payment,
      Announcement,
      Assignment,
      Attendance,
      Grade,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}