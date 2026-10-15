import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CourseMaterial } from './entities/course-material.entity';
import { CourseMaterialsService } from './course-materials.service';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

@Controller('course-materials')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseMaterialsController {
  constructor(private readonly service: CourseMaterialsService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.DEPT_HEAD)
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.service.findAll(user);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.DEPT_HEAD)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.findOne(id, user);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.DEPT_HEAD)
  create(
    @Body() data: Partial<CourseMaterial>,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.create(data, user);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.DEPT_HEAD)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CourseMaterial>,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.update(id, data, user);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.remove(id, user);
  }
}