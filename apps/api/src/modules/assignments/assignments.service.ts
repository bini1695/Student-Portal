import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly repo: Repository<Assignment>,
  ) {}

  findAll() {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const a = await this.repo.findOne({ where: { id } });
    if (!a) throw new NotFoundException(`Assignment #${id} not found`);
    return a;
  }

  create(data: Partial<Assignment>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Assignment>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: `Assignment #${id} deleted` };
  }
}