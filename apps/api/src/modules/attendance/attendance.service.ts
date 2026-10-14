import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
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

  async create(data: Partial<Attendance>) {
    try {
      return await this.repo.save(this.repo.create(data));
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException(
          'Attendance has already been recorded for this student and date',
        );
      }
      throw error;
    }
  }

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