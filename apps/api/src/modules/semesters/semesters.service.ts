import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semester } from './entities/semester.entity';

@Injectable()
export class SemestersService {
  constructor(@InjectRepository(Semester) private readonly repo: Repository<Semester>) {}

  findAll() { return this.repo.find({ order: { id: 'ASC' } }); }

  async findOne(id: number) {
    const s = await this.repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException(`Semester #${id} not found`);
    return s;
  }

  async create(data: Partial<Semester>) {
    return this.repo.manager.transaction(async (manager) => {
      if (data.isCurrent) await manager.update(Semester, { isCurrent: true }, { isCurrent: false });
      return manager.save(Semester, manager.create(Semester, data));
    });
  }

  async update(id: number, data: Partial<Semester>) {
    await this.findOne(id);
    return this.repo.manager.transaction(async (manager) => {
      if (data.isCurrent) await manager.update(Semester, { isCurrent: true }, { isCurrent: false });
      await manager.update(Semester, id, data);
      return manager.findOneByOrFail(Semester, { id });
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: `Semester #${id} deleted` };
  }
}