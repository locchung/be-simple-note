import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  readonly title?: string;
  readonly content?: string;
  readonly updated_at: Date;
}
