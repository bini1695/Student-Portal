import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly repo: Repository<Student>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['user'], order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const s = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!s) throw new NotFoundException(`Student #${id} not found`);
    return s;
  }

  async findByUserId(userId: number) {
    return this.repo.findOne({ where: { userId }, relations: ['user'] });
  }

  create(data: Partial<Student>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Student>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: `Student #${id} deleted` };
  }
}