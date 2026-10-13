import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(@InjectRepository(Invoice) private readonly repo: Repository<Invoice>) {}

  findAll() { return this.repo.find({ order: { id: 'DESC' } }); }

  async findOne(id: number) {
    const i = await this.repo.findOne({ where: { id } });
    if (!i) throw new NotFoundException(`Invoice #${id} not found`);
    return i;
  }

  create(data: Partial<Invoice>) { return this.repo.save(this.repo.create(data)); }

  async update(id: number, data: Partial<Invoice>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: `Invoice #${id} deleted` };
  }
}