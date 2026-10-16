import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Enrollment } from './entities/enrollment.entity';
import { EnrollmentsService } from './enrollments.service';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentsController {
  constructor(private readonly service: EnrollmentsService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.DEPT_HEAD)
  findAll(@CurrentUser() user: AuthenticatedUser) { return this.service.findAll(user); }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.DEPT_HEAD)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) { return this.service.findOne(id, user); }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.STUDENT)
  create(@Body() data: Partial<Enrollment>, @CurrentUser() user: AuthenticatedUser) {
    return this.service.create(data, user);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.STUDENT, Role.DEPT_HEAD)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { status?: Enrollment['status']; approvedBy?: number; approvedAt?: Date },
    @CurrentUser() user: AuthenticatedUser,
  ) { return this.service.update(id, data, user); }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) { return this.service.remove(id, user); }
}