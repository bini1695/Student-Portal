import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Course } from '../courses/entities/course.entity';
import { Department } from '../departments/entities/department.entity';
import { CourseSection } from './entities/course-section.entity';
import { CourseSectionsService } from './course-sections.service';
import { CourseSectionsController } from './course-sections.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CourseSection, Teacher, Course, Department])],
  controllers: [CourseSectionsController],
  providers: [CourseSectionsService],
  exports: [CourseSectionsService],
})
export class CourseSectionsModule {}