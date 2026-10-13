import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Get()
  root() {
    return {
      name: 'Student Portal API',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/api/health',
        auth: {
          login: 'POST /api/auth/login',
          register: 'POST /api/auth/register',
          me: 'GET /api/auth/me',
        },
        resources: {
          users: '/api/users',
          roles: '/api/roles',
          departments: '/api/departments',
          students: '/api/students',
          teachers: '/api/teachers',
          academicYears: '/api/academic-years',
          semesters: '/api/semesters',
          courses: '/api/courses',
          courseSections: '/api/course-sections',
          enrollments: '/api/enrollments',
          grades: '/api/grades',
          attendance: '/api/attendance',
          announcements: '/api/announcements',
          fees: '/api/fees',
          invoices: '/api/invoices',
          payments: '/api/payments',
          dashboard: '/api/dashboard/me',
        },
      },
    };
  }

  @Get('health')
  async health() {
    const isConnected = this.dataSource.isInitialized;
    return {
      status: isConnected ? 'ok' : 'error',
      database: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }
}