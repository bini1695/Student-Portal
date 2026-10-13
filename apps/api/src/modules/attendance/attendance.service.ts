import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(@InjectRepository(Attendance) private readonly repo: Repository<Attendance>) {}

  findAll() { return this.repo.find({ order: { id: 'ASC' } }); }

  async findOne(id: number) {
    const a = await this.repo.findOne({ where: { id } });
    if (!a) throw new NotFoundException(`Attendance #${id} not found`);
    return a;
  }

  create(data: Partial<Attendance>) { return this.repo.save(this.repo.create(data)); }

  async update(id: number, data: Partial<Attendance>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: `Attendance #${id} deleted` };
  }
}