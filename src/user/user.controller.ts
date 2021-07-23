import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from '@app/user/dtos';
import { IUserResponse } from '@app/user/types/userResponse.interface';
import { User } from './decorators/user.decorator';
import { UserEntity } from './user.entity';
import { AuthGuard } from './guards/auth.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/users')
  @UsePipes(new ValidationPipe())
  public async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('/user/login')
  @UsePipes(new ValidationPipe())
  public async loginUser(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  public async currentUser(@User() user: UserEntity): Promise<IUserResponse> {
    return this.userService.buildUserResponse(user);
  }

  @Put('/user')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  public async updateUser(
    @User('id') id: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.updateUser(id, updateUserDto);
    return this.userService.buildUserResponse(user);
  }
}
