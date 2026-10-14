import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role?.name,     // ← e.g. "super_admin", "admin", "student"
        roleId: user.roleId,       // ← numeric role id
      },
    };
  }

  async register(dto: RegisterDto) {
    // Check duplicate
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      fullName: dto.fullName,
      phone: dto.phone,
      roleId: dto.roleId ?? 4, // default: student
    });

    // Return without password hash
    return {
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roleId: user.roleId,
      },
    };
  }

  async profile(userId: number) {
    const user = await this.usersService.findOne(userId);
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      status: user.status,
      role: user.role?.name,
      roleId: user.roleId,
    };
  }
}