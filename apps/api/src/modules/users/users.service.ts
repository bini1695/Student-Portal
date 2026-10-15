import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Student } from '../students/entities/student.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,
  ) {}

  async findAll(): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await this.usersRepo.find({
      relations: ['role'],
      order: { id: 'ASC' },
    });
    return users.map(({ passwordHash: _passwordHash, ...user }) => user);
  }

  async findOne(id: number): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findRoleIdByName(name: string): Promise<number> {
    const role = await this.rolesRepo.findOne({ where: { name } });
    if (!role) throw new NotFoundException(`Role "${name}" is not configured`);
    return role.id;
  }

  async findOneRoleNameById(id: number): Promise<string> {
    const role = await this.rolesRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role #${id} not found`);
    return role.name;
  }

  async create(dto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.usersRepo.manager.transaction(async (manager) => {
      const user = manager.create(User, {
        roleId: dto.roleId,
        email: dto.email,
        fullName: dto.fullName,
        phone: dto.phone,
        status: dto.status ?? 'active',
        passwordHash,
      });
      const savedUser = await manager.save(User, user);
      const role = await manager.findOneBy(Role, { id: dto.roleId });
      if (!role) throw new NotFoundException(`Role #${dto.roleId} not found`);
      if (role.name === 'student') {
        const student = manager.create(Student, {
          userId: savedUser.id,
          studentCode: `STU-${String(savedUser.id).padStart(6, '0')}`,
          admissionDate: new Date(),
          currentSemester: 1,
          status: 'pending',
        });
        await manager.save(Student, student);
      }
      const { passwordHash: _passwordHash, ...safeUser } = savedUser;
      return safeUser;
    });
  }

  async update(id: number, dto: UpdateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    const { password, ...updates } = dto;
    if (password) user.passwordHash = await bcrypt.hash(password, 10);
    Object.assign(user, updates);
    await this.usersRepo.save(user);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    await this.usersRepo.remove(user);
    return { message: `User #${id} deleted` };
  }
}