import { Document } from 'mongoose';

export interface Note extends Document {
  readonly user_id: string;
  readonly title: string;
  readonly content: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}
