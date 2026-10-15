import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findAll(@CurrentUser() user: { id: number; role: Role }) { return this.service.findAll(user); }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number; role: Role },
  ) { return this.service.findOne(id, user); }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  create(@Body() data: AttendanceInput, @CurrentUser() user: { id: number; role: Role }) {
    return this.service.create(data, user);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<AttendanceInput>,
    @CurrentUser() user: { id: number; role: Role },
  ) { return this.service.update(id, data, user); }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number; role: Role }) {
    return this.service.remove(id, user);
  }
}

interface AttendanceInput {
  courseSectionId: number;
  studentId: number;
  attendanceDate: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}