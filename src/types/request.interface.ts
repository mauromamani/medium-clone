import { UserEntity } from '@app/user/user.entity';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: UserEntity;
}
