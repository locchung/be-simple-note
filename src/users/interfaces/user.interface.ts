import { Document } from 'mongoose';

export interface User extends Document {
  readonly username: string;
  readonly password: string;
  readonly salt: string;
  readonly full_name: string;
  readonly email: string;
  readonly avatar: string;
  readonly google_user_id: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly last_login: Date;
}
