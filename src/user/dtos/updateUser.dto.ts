import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsNotEmpty()
  readonly username: string;

  @IsOptional()
  @IsNotEmpty()
  readonly password: string;

  @IsOptional()
  @IsNotEmpty()
  readonly image: string;

  @IsOptional()
  @IsNotEmpty()
  readonly bio: string;
}
