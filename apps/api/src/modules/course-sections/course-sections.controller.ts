import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CourseSectionsService } from './course-sections.service';
import { CourseSection } from './entities/course-section.entity';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

@Controller('course-sections')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseSectionsController {
  constructor(private readonly service: CourseSectionsService) {}

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
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.DEPT_HEAD)
  create(@Body() data: Partial<CourseSection>, @CurrentUser() user: AuthenticatedUser) {
    return this.service.create(data, user);
  }

  @Post(':id/review')
  @Roles(Role.DEPT_HEAD)
  reviewOffering(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { approved: boolean },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.reviewOffering(id, data.approved, user.id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.DEPT_HEAD)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CourseSection>,
    @CurrentUser() user: AuthenticatedUser,
  ) { return this.service.update(id, data, user); }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) { return this.service.remove(id, user); }
}