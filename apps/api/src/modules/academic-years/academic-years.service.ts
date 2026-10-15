import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicYear } from './entities/academic-year.entity';

@Injectable()
export class AcademicYearsService {
  constructor(@InjectRepository(AcademicYear) private readonly repo: Repository<AcademicYear>) {}

  findAll() { return this.repo.find({ order: { id: 'ASC' } }); }

  async findOne(id: number) {
    const y = await this.repo.findOne({ where: { id } });
    if (!y) throw new NotFoundException(`AcademicYear #${id} not found`);
    return y;
  }

  async create(data: Partial<AcademicYear>) {
    return this.repo.manager.transaction(async (manager) => {
      if (data.isCurrent) await manager.update(AcademicYear, { isCurrent: true }, { isCurrent: false });
      return manager.save(AcademicYear, manager.create(AcademicYear, data));
    });
  }

  async update(id: number, data: Partial<AcademicYear>) {
    await this.findOne(id);
    return this.repo.manager.transaction(async (manager) => {
      if (data.isCurrent) {
        await manager.update(AcademicYear, { isCurrent: true }, { isCurrent: false });
      }
      await manager.update(AcademicYear, id, data);
      return manager.findOneByOrFail(AcademicYear, { id });
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: `AcademicYear #${id} deleted` };
  }
}