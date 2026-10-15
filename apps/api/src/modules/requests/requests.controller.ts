import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Request } from './entities/request.entity';
import { RequestsService } from './requests.service';

interface AuthenticatedUser {
  id: number;
  role: string;
}

@Controller('requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RequestsController {
  constructor(private readonly service: RequestsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.service.findVisible(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.findOneVisible(id, user);
  }

  @Post()
  @Roles(Role.STUDENT, Role.SUPER_ADMIN, Role.ADMIN, Role.DEPT_HEAD)
  create(
    @Body() data: { type?: Request['type']; description?: string | null; studentId?: number; status?: Request['status'] },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (user.role === Role.STUDENT) {
      return this.service.createForStudent(user.id, {
        type: data.type,
        description: data.description ?? null,
      });
    }
    return this.service.createForStaff(data);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.DEPT_HEAD)
  update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<Request>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}