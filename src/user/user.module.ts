import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from '@app/user/user.controller';
import { UserService } from '@app/user/user.service';
import { UserEntity } from '@app/user/user.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { ValidationErrorsService } from '@app/shared/validationErrors.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, AuthGuard, ValidationErrorsService],
  exports: [UserService], // Exportamos para que pueda ser inyectado en cualquier otro lugar fuera de este modulo, para el middleware que esta de forma global
})
export class UserModule {}
