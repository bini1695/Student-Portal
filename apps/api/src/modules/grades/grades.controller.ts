import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Grade } from './entities/grade.entity';
import { GradesService } from './grades.service';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

@Controller('grades')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GradesController {
  constructor(private readonly service: GradesService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.DEPT_HEAD)
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.service.findAll(user);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.DEPT_HEAD)
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.service.findOne(id, user);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  create(@Body() data: Partial<Grade>, @CurrentUser() user: AuthenticatedUser) {
    return this.service.create(data, user);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Grade>,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.update(id, data, user);
  }

  @Post(':id/submit')
  @Roles(Role.TEACHER)
  submit(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.service.submit(id, user);
  }

  @Post(':id/review')
  @Roles(Role.DEPT_HEAD)
  review(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { approved: boolean },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.approve(id, data.approved, user);
  }
}
