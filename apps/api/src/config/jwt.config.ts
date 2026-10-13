import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'change-this-secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
}));