import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { Role } from '../../common/constants/roles.enum';
import { Department } from '../departments/entities/department.entity';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly repo: Repository<Teacher>,
    @InjectRepository(Department)
    private readonly departmentsRepo: Repository<Department>,
  ) {}

  async findAll(user: AuthenticatedUser) {
    if (user.role === Role.DEPT_HEAD) {
      const department = await this.departmentsRepo.findOne({ where: { headUserId: user.id } });
      if (!department) return [];
      return this.repo.find({
        where: { departmentId: department.id },
        relations: ['user'],
        order: { id: 'ASC' },
      });
    }
    return this.repo.find({ relations: ['user'], order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const t = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!t) throw new NotFoundException(`Teacher #${id} not found`);
    return t;
  }

  create(data: Partial<Teacher>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Teacher>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: `Teacher #${id} deleted` };
  }
}