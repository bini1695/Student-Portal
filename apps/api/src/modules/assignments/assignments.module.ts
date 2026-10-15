import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { CourseSection } from '../course-sections/entities/course-section.entity';
import { Assignment } from './entities/assignment.entity';
import { Submission } from './entities/submission.entity';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, Submission, Student, Enrollment, Teacher, CourseSection])],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
})
export class AssignmentsModule {}