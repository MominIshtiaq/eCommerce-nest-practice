import { registerAs } from '@nestjs/config';

export default registerAs('corsConfig', () => ({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:3002'];
    if (origin && allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Version'],
  exposedHeaders: ['Content-Range'],
}));
