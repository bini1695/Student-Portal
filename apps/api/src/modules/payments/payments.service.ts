import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../common/constants/roles.enum';
import { Invoice } from '../invoices/entities/invoice.entity';
import { Student } from '../students/entities/student.entity';
import { Payment } from './entities/payment.entity';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private readonly repo: Repository<Payment>,
    @InjectRepository(Invoice) private readonly invoicesRepo: Repository<Invoice>,
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

  async findOne(id: number, user?: AuthenticatedUser) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException(`Payment #${id} not found`);
    if (user?.role === Role.STUDENT) {
      const student = await this.studentsRepo.findOne({ where: { userId: user.id } });
      if (!student) throw new NotFoundException('Student profile not found for this account');
      if (p.studentId !== student.id) throw new ForbiddenException();
    }
    return p;
  }

  async create(data: Partial<Payment>, user: AuthenticatedUser) {
    const invoice = await this.invoicesRepo.findOne({ where: { id: data.invoiceId } });
    if (!invoice) throw new NotFoundException(`Invoice #${data.invoiceId} not found`);

    let studentId = data.studentId;
    if (user.role === Role.STUDENT) {
      const student = await this.studentsRepo.findOne({ where: { userId: user.id } });
      if (!student) throw new NotFoundException('Student profile not found for this account');
      if (invoice.studentId !== student.id) throw new ForbiddenException();
      studentId = student.id;
    } else if (user.role !== Role.ACCOUNTANT && user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException();
    }

    const amount = Number(data.amount);
    if (!Number.isFinite(amount) || amount <= 0) throw new BadRequestException('Payment amount must be greater than zero.');
    if (studentId !== invoice.studentId) throw new BadRequestException('Payment student does not own this invoice.');
    if (amount > Number(invoice.totalDue) - Number(invoice.amountPaid)) {
      throw new BadRequestException('Payment amount exceeds the outstanding invoice balance.');
    }

    return this.repo.save(this.repo.create({
      invoiceId: invoice.id,
      studentId: invoice.studentId,
      amount,
      method: data.method,
      referenceNo: data.referenceNo,
      notes: data.notes,
      receivedBy: user.role === Role.STUDENT ? null : user.id,
      verificationStatus: user.role === Role.STUDENT ? 'pending' : 'verified',
      verifiedBy: user.role === Role.STUDENT ? null : user.id,
      verifiedAt: user.role === Role.STUDENT ? null : new Date(),
    }));
  }

  async verify(id: number, status: 'verified' | 'rejected', userId: number) {
    await this.repo.manager.transaction(async (manager) => {
      const payment = await manager.findOne(Payment, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!payment) throw new NotFoundException(`Payment #${id} not found`);
      if (payment.verificationStatus !== 'pending') {
        throw new BadRequestException('Only pending payments can be verified or rejected.');
      }
      if (status === 'verified') {
        const invoice = await manager.findOne(Invoice, {
          where: { id: payment.invoiceId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!invoice) throw new NotFoundException(`Invoice #${payment.invoiceId} not found`);
        const updatedAmountPaid = Number(invoice.amountPaid) + Number(payment.amount);
        if (updatedAmountPaid > Number(invoice.totalDue)) {
          throw new BadRequestException('Verifying this payment would exceed the invoice balance.');
        }
        await manager.update(Invoice, invoice.id, {
          amountPaid: updatedAmountPaid,
          status: updatedAmountPaid >= Number(invoice.totalDue) ? 'paid' : 'partial',
        });
      }
      await manager.update(Payment, id, {
        verificationStatus: status,
        verifiedBy: userId,
        verifiedAt: new Date(),
        receivedBy: userId,
      });
    });
    return this.findOne(id);
  }

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