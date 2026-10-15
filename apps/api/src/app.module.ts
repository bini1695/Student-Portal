import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import databaseConfig from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { AcademicYearsModule } from './modules/academic-years/academic-years.module';
import { SemestersModule } from './modules/semesters/semesters.module';
import { CoursesModule } from './modules/courses/courses.module';
import { CourseSectionsModule } from './modules/course-sections/course-sections.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { GradesModule } from './modules/grades/grades.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { FeesModule } from './modules/fees/fees.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { CourseMaterialsModule } from './modules/course-materials/course-materials.module';
import { RequestsModule } from './modules/requests/requests.module';
import { FinancialHoldsModule } from './modules/financial-holds/financial-holds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        autoLoadEntities: true,
        synchronize: false,
        logging: ['error', 'warn'],
        charset: 'utf8mb4',
      }),
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    DepartmentsModule,
    StudentsModule,
    TeachersModule,
    DashboardModule,
    AcademicYearsModule,
    SemestersModule,
    CoursesModule,
    CourseSectionsModule,
    EnrollmentsModule,
    GradesModule,
    AttendanceModule,
    AnnouncementsModule,
    FeesModule,
    InvoicesModule,
    PaymentsModule,
    AssignmentsModule,
    CourseMaterialsModule,
    RequestsModule,
    FinancialHoldsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}