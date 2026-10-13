import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeeStructure } from './entities/fee-structure.entity';

@Injectable()
export class FeesService {
  constructor(@InjectRepository(FeeStructure) private readonly repo: Repository<FeeStructure>) {}

  findAll() { return this.repo.find({ order: { id: 'ASC' } }); }

  async findOne(id: number) {
    const f = await this.repo.findOne({ where: { id } });
    if (!f) throw new NotFoundException(`FeeStructure #${id} not found`);
    return f;
  }

  create(data: Partial<FeeStructure>) { return this.repo.save(this.repo.create(data)); }

  async update(id: number, data: Partial<FeeStructure>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: `FeeStructure #${id} deleted` };
  }
}