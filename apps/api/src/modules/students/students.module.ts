import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { CourseSection } from '../course-sections/entities/course-section.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Department } from '../departments/entities/department.entity';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Teacher, CourseSection, Enrollment, Department])],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}