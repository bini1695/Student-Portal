import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseSection } from './entities/course-section.entity';

@Injectable()
export class CourseSectionsService {
  constructor(@InjectRepository(CourseSection) private readonly repo: Repository<CourseSection>) {}

  findAll() { return this.repo.find({ order: { id: 'ASC' } }); }

  async findOne(id: number) {
    const s = await this.repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException(`CourseSection #${id} not found`);
    return s;
  }

  create(data: Partial<CourseSection>) { return this.repo.save(this.repo.create(data)); }

  async update(id: number, data: Partial<CourseSection>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: `CourseSection #${id} deleted` };
  }
}