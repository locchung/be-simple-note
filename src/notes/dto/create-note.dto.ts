import { IsString } from "class-validator";

export class CreateNoteDto {
  @IsString()
  readonly title: string;
  readonly content: string;

  @IsString()
  readonly user_id: string;

  readonly created_at: Date;
  readonly updated_at: Date;
}
