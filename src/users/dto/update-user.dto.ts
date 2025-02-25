import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  readonly username?: string;
  readonly full_name?: string;
  readonly avatar?: string;
  readonly updated_at?: Date;
  readonly last_login?: Date;
}
