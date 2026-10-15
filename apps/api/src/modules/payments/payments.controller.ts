import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payments.service';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT, Role.STUDENT)
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.service.findAll(user);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT, Role.STUDENT)
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.service.findOne(id, user);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT, Role.STUDENT)
  create(@Body() data: Partial<Payment>, @CurrentUser() user: AuthenticatedUser) {
    return this.service.create(data, user);
  }

  @Patch(':id/verification')
  @Roles(Role.ACCOUNTANT, Role.ADMIN, Role.SUPER_ADMIN)
  verify(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { status: 'verified' | 'rejected' },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.verify(id, data.status, user.id);
  }
}
