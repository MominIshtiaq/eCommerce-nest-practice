import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class ValidateFile implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Workking');
    const allowedTypes = ['products', 'users'];
    const { type } = req.params;
    if (!allowedTypes.includes(type))
      throw new BadRequestException(`Type ${type} is not allowed.`);
    next();
  }
}
