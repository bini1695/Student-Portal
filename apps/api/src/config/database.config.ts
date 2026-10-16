import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host:
    process.env.DB_HOST ||
    (process.env.NODE_ENV === 'production' ? 'mysql' : 'localhost'),
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USER || 'student_portal',
  password: process.env.DB_PASSWORD || 'pass123',
  database: process.env.DB_NAME || 'student_portal',
}));