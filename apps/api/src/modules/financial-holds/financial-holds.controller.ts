import { Body, Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FinancialHoldsService } from './financial-holds.service';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

@Controller('financial-holds')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ACCOUNTANT, Role.ADMIN, Role.SUPER_ADMIN)
export class FinancialHoldsController {
  constructor(private readonly service: FinancialHoldsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':studentId')
  setHold(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() data: { active: boolean; reason?: string },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.setHold(studentId, data.active, data.reason, user);
  }
}
