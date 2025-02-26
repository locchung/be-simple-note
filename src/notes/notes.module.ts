import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { DatabaseModule } from 'src/database/database.module';
import { notesProviders } from './notes.providers';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [NotesController],
  providers: [
    NotesService,
    ...notesProviders
  ],
})
export class NotesModule {}
