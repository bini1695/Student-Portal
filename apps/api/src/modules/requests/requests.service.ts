import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { Request } from './entities/request.entity';

interface AuthenticatedUser {
  id: number;
  role: string;
}

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request) private readonly requestsRepo: Repository<Request>,
    @InjectRepository(Student) private readonly studentsRepo: Repository<Student>,
  ) {}

  async findVisible(user: AuthenticatedUser) {
    if (user.role !== 'student') return this.requestsRepo.find({ order: { createdAt: 'DESC' } });
    const student = await this.studentsRepo.findOne({ where: { userId: user.id } });
    if (!student) return [];
    return this.requestsRepo.find({
      where: { studentId: student.id },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneVisible(id: number, user: AuthenticatedUser) {
    const request = await this.requestsRepo.findOne({ where: { id } });
    if (!request) throw new NotFoundException(`Request #${id} not found`);
    if (user.role === 'student') {
      const student = await this.studentsRepo.findOne({ where: { userId: user.id } });
      if (!student || request.studentId !== student.id) throw new ForbiddenException();
    }
    return request;
  }

  async createForStudent(
    userId: number,
    data: { type?: Request['type']; description?: string | null },
  ) {
    const validTypes: Request['type'][] = ['transcript', 'certificate', 'leave', 'other'];
    if (!data.type || !validTypes.includes(data.type)) {
      throw new BadRequestException('Select a valid request type.');
    }
    const student = await this.studentsRepo.findOne({ where: { userId } });
    if (!student) throw new NotFoundException('Student profile not found for this account');
    return this.requestsRepo.save(this.requestsRepo.create({
      studentId: student.id,
      type: data.type,
      description: data.description ?? null,
      status: 'pending',
    }));
  }

  async createForStaff(data: Partial<Request>) {
    return this.requestsRepo.save(this.requestsRepo.create(data));
  }

  async update(id: number, data: Partial<Request>) {
    const request = await this.requestsRepo.findOne({ where: { id } });
    if (!request) throw new NotFoundException(`Request #${id} not found`);
    await this.requestsRepo.update(id, data);
    return this.requestsRepo.findOneByOrFail({ id });
  }

  async remove(id: number) {
    const request = await this.requestsRepo.findOne({ where: { id } });
    if (!request) throw new NotFoundException(`Request #${id} not found`);
    await this.requestsRepo.remove(request);
    return { message: `Request #${id} deleted` };
  }
}