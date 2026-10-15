import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { StudentsService } from './students.service';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT, Role.TEACHER, Role.DEPT_HEAD)
  findAll(@CurrentUser() user: { id: number; role: Role }) { return this.service.findAll(user); }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT, Role.TEACHER, Role.DEPT_HEAD, Role.STUDENT)
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number; role: Role }) {
    return this.service.findOne(id, user);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  create(@Body() data: any) { return this.service.create(data); }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}