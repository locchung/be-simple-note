import { Mongoose } from 'mongoose';
import Note from './schemas/note.schema';

export const notesProviders = [
  {
    provide: 'NOTE_MODEL',
    useFactory: (mongoose: Mongoose) => Note,
    inject: ['DATABASE_CONNECTION'],
  },
];
