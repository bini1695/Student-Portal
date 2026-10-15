import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../common/constants/roles.enum';
import { Student } from '../students/entities/student.entity';
import { Invoice } from './entities/invoice.entity';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private readonly repo: Repository<Invoice>,
    @InjectRepository(Student) private readonly studentsRepo: Repository<Student>,
  ) {}

  async findAll(user: AuthenticatedUser) {
    if (user.role === Role.STUDENT) {
      const student = await this.studentsRepo.findOne({ where: { userId: user.id } });
      if (!student) throw new NotFoundException('Student profile not found for this account');
      return this.repo.find({ where: { studentId: student.id }, order: { id: 'DESC' } });
    }
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const invoice = await this.repo.findOne({ where: { id } });
    if (!invoice) throw new NotFoundException(`Invoice #${id} not found`);
    if (user.role === Role.STUDENT) {
      const student = await this.studentsRepo.findOne({ where: { userId: user.id } });
      if (!student) throw new NotFoundException('Student profile not found for this account');
      if (invoice.studentId !== student.id) throw new ForbiddenException();
    }
    return invoice;
  }

  create(data: Partial<Invoice>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Invoice>) {
    await this.repo.findOneByOrFail({ id });
    await this.repo.update(id, data);
    return this.repo.findOneByOrFail({ id });
  }

  async remove(id: number) {
    await this.repo.findOneByOrFail({ id });
    await this.repo.delete(id);
    return { message: `Invoice #${id} deleted` };
  }
}
