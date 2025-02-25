import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  readonly username: string;
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  readonly password: string;
  readonly salt: string;
  // readonly full_name: string;
  @IsEmail({}, { message: 'Invalid email format' }) // Email must be valid
  readonly email: string;
  // readonly avatar: string;
  // readonly google_user_id: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  // readonly last_login: Date;
}
