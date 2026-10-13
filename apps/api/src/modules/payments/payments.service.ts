import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(@InjectRepository(Payment) private readonly repo: Repository<Payment>) {}

  findAll() { return this.repo.find({ order: { id: 'DESC' } }); }

  async findOne(id: number) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException(`Payment #${id} not found`);
    return p;
  }

  create(data: Partial<Payment>) { return this.repo.save(this.repo.create(data)); }

  async update(id: number, data: Partial<Payment>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: `Payment #${id} deleted` };
  }
}