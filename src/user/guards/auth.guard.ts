import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { RequestWithUser } from '@app/types/request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
