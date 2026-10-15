import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from '../../common/constants/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    if (user.status !== 'active') {
      throw new UnauthorizedException('This account is inactive. Contact an administrator.');
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
        role: user.role?.name,
        roleId: user.roleId,
      },
    };
  }

  async register(dto: RegisterDto) {
    if (dto.roleId !== undefined) {
      const requestedRole = await this.usersService.findOneRoleNameById(dto.roleId);
      if (requestedRole !== Role.STUDENT) {
        throw new ForbiddenException('Public registration is limited to student accounts. Contact an administrator for staff access.');
      }
    }
    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      fullName: dto.fullName,
      phone: dto.phone,
      roleId: await this.usersService.findRoleIdByName(Role.STUDENT),
    });
    return user;
  }

  async profile(userId: number) {
    return this.usersService.findOne(userId);
  }
}