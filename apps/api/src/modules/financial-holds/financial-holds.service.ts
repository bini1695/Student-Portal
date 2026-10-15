import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../common/constants/roles.enum';
import { Student } from '../students/entities/student.entity';
import { FinancialHold } from './entities/financial-hold.entity';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

@Injectable()
export class FinancialHoldsService {
  constructor(
    @InjectRepository(FinancialHold) private readonly repo: Repository<FinancialHold>,
    @InjectRepository(Student) private readonly studentsRepo: Repository<Student>,
  ) {}

  async findAll() {
    return this.repo.find({ where: { active: true }, order: { createdAt: 'DESC' } });
  }

  async setHold(studentId: number, active: boolean, reason: string | undefined, user: AuthenticatedUser) {
    const student = await this.studentsRepo.findOne({ where: { id: studentId } });
    if (!student) throw new NotFoundException(`Student #${studentId} not found`);
    const existing = await this.repo.findOne({ where: { studentId } });

    if (active) {
      const holdReason = reason?.trim() || existing?.reason;
      if (!holdReason) throw new BadRequestException('A reason is required to place a financial hold.');
      return this.repo.save(this.repo.create({
        ...existing,
        studentId,
        reason: holdReason,
        active: true,
        createdBy: user.id,
        resolvedBy: null,
        resolvedAt: null,
      }));
    }

    if (!existing || !existing.active) {
      throw new NotFoundException(`Active financial hold for student #${studentId} not found`);
    }
    existing.active = false;
    existing.resolvedBy = user.id;
    existing.resolvedAt = new Date();
    return this.repo.save(existing);
  }

  async hasActiveHold(studentId: number) {
    return this.repo.exist({ where: { studentId, active: true } });
  }
}
