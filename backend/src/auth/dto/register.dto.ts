import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export default class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;
}
