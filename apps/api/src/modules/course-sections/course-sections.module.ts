import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseSection } from './entities/course-section.entity';
import { CourseSectionsService } from './course-sections.service';
import { CourseSectionsController } from './course-sections.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CourseSection])],
  controllers: [CourseSectionsController],
  providers: [CourseSectionsService],
  exports: [CourseSectionsService],
})
export class CourseSectionsModule {}