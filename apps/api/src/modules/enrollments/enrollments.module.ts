import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { CourseSection } from '../course-sections/entities/course-section.entity';
import { FinancialHold } from '../financial-holds/entities/financial-hold.entity';
import { Semester } from '../semesters/entities/semester.entity';
import { Department } from '../departments/entities/department.entity';
import { Enrollment } from './entities/enrollment.entity';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Student, Teacher, CourseSection, FinancialHold, Semester, Department])],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}