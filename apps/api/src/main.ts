import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // ===== Swagger Setup =====
  const config = new DocumentBuilder()
    .setTitle('Student Portal API')
    .setDescription('API documentation for the Student Portal & Enrollment System')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('roles', 'Role management')
    .addTag('departments', 'Departments')
    .addTag('students', 'Students')
    .addTag('teachers', 'Teachers')
    .addTag('courses', 'Courses')
    .addTag('enrollments', 'Enrollments')
    .addTag('grades', 'Grades')
    .addTag('payments', 'Payments')
    .addTag('dashboard', 'Dashboard stats')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.API_PORT || 4000;
  await app.listen(port);

  console.log(`🚀 API running on http://localhost:${port}/api`);
  console.log(`📚 Swagger docs on http://localhost:${port}/api/docs`);
}

bootstrap();