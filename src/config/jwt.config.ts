import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'medicare-super-secret-key-2024',
  expiresIn: process.env.JWT_EXPIRATION || '7d',
  algorithm: 'HS256',
}));
