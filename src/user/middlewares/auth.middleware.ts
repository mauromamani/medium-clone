import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { RequestWithUser } from '@app/types/request.interface';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: RequestWithUser, _res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      return next();
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const { uid } = verify(token, 'SUPER-SECRET');
      req.user = await this.userService.findUserById(uid);
      return next();
    } catch (error) {
      req.user = null;
      return next();
    }
  }
}
