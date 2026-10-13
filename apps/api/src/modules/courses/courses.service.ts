import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(@InjectRepository(Course) private readonly repo: Repository<Course>) {}

  findAll() { return this.repo.find({ order: { id: 'ASC' } }); }

  async findOne(id: number) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException(`Course #${id} not found`);
    return c;
  }

  create(data: Partial<Course>) { return this.repo.save(this.repo.create(data)); }

  async update(id: number, data: Partial<Course>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: `Course #${id} deleted` };
  }
}