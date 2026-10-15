import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Assignment } from './entities/assignment.entity';
import { Submission } from './entities/submission.entity';
import { AssignmentsService } from './assignments.service';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(private readonly service: AssignmentsService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.DEPT_HEAD)
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.service.findAll(user);
  }

  @Get(':id/submissions/me')
  @Roles(Role.STUDENT)
  mySubmission(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.service.getMySubmission(id, user.id);
  }

  @Get(':id/submissions')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.DEPT_HEAD)
  submissions(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.getSubmissions(id, user);
  }

  @Post(':id/submissions')
  @Roles(Role.STUDENT)
  submit(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() data: Pick<Submission, 'submissionText' | 'filePath'>,
  ) {
    return this.service.submit(id, user.id, data);
  }

  @Patch(':id/submissions/:submissionId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.DEPT_HEAD)
  grade(
    @Param('id', ParseIntPipe) id: number,
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() data: { score: number; feedback?: string },
  ) {
    return this.service.gradeSubmission(id, submissionId, user, data.score, data.feedback);
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
    @Body() data: Partial<Assignment>,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.create(data, user);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.DEPT_HEAD)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Assignment>,
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