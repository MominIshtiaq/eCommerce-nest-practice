import { registerAs } from '@nestjs/config';

export default registerAs('authConfigurations', () => ({
  secret: process.env.JWT_TOKEN_SECRET,
  expireIn: parseInt(process.env.JWT_TOKEN_EXPIRESIN ?? '3600', 10),
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
}));
