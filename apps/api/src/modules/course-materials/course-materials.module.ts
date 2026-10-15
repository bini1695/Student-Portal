import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { CourseSection } from '../course-sections/entities/course-section.entity';
import { CourseMaterial } from './entities/course-material.entity';
import { CourseMaterialsController } from './course-materials.controller';
import { CourseMaterialsService } from './course-materials.service';

@Module({
  imports: [TypeOrmModule.forFeature([CourseMaterial, Enrollment, Student, Teacher, CourseSection])],
  controllers: [CourseMaterialsController],
  providers: [CourseMaterialsService],
})
export class CourseMaterialsModule {}