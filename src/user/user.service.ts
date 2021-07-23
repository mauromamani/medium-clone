import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@app/user/user.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '@app/user/dtos';
import { IUserResponse } from '@app/user/types/userResponse.interface';
import { generateJwt } from '@app/utils/jwt.util';
import { comparePassword } from '@app/utils/bcrypt.util';
import { ValidationErrorsService } from '@app/shared/validationErrors.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly validationErrorsService: ValidationErrorsService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (userByEmail) {
      this.validationErrorsService.addError(
        'Email or Username',
        'Email or Username are taken!',
      );
      throw new HttpException(
        this.validationErrorsService.getErrors(),
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity(createUserDto);
    return await this.userRepository.save(newUser);
  }

  public async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      this.validationErrorsService.addError(
        'Email or Password',
        'Invalid email or password!',
      );
      throw new HttpException(
        this.validationErrorsService.getErrors(),
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      this.validationErrorsService.addError(
        'Email or Password',
        'Invalid email or password!',
      );
      throw new HttpException(
        this.validationErrorsService.getErrors(),
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    delete user.password;
    return user;
  }

  public async buildUserResponse(user: UserEntity): Promise<IUserResponse> {
    return {
      user: {
        ...user,
        token: await generateJwt(user.id),
      },
    };
  }

  public async findUserById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({ id });
  }

  public async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findUserById(id);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }
}
