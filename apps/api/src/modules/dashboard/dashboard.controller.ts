import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('me')
  async myDashboard(@CurrentUser() user: any) {
    return this.dashboardService.statsForRole(user.id, user.role);
  }

  @Get('super-admin')
  superAdmin() {
    return this.dashboardService.superAdminStats();
  }

  @Get('admin')
  admin() {
    return this.dashboardService.adminStats();
  }

  @Get('teacher')
  teacher(@CurrentUser() user: any) {
    return this.dashboardService.teacherStats(user.id);
  }

  @Get('student')
  student(@CurrentUser() user: any) {
    return this.dashboardService.studentStats(user.id);
  }

  @Get('accountant')
  accountant() {
    return this.dashboardService.accountantStats();
  }

  @Get('dept-head')
  deptHead(@CurrentUser() user: any) {
    return this.dashboardService.deptHeadStats(user.id);
  }
}