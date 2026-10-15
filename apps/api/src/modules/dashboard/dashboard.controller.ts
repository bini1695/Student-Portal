import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.enum';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('me')
  async myDashboard(@CurrentUser() user: any) {
    return this.dashboardService.statsForRole(user.id, user.role);
  }

  @Get('super-admin')
  @Roles(Role.SUPER_ADMIN)
  superAdmin() {
    return this.dashboardService.superAdminStats();
  }

  @Get('admin')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  admin() {
    return this.dashboardService.adminStats();
  }

  @Get('teacher')
  @Roles(Role.TEACHER)
  teacher(@CurrentUser() user: any) {
    return this.dashboardService.teacherStats(user.id);
  }

  @Get('student')
  @Roles(Role.STUDENT)
  student(@CurrentUser() user: any) {
    return this.dashboardService.studentStats(user.id);
  }

  @Get('accountant')
  @Roles(Role.ACCOUNTANT)
  accountant() {
    return this.dashboardService.accountantStats();
  }

  @Get('dept-head')
  @Roles(Role.DEPT_HEAD)
  deptHead(@CurrentUser() user: any) {
    return this.dashboardService.deptHeadStats(user.id);
  }
}