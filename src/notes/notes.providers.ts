import { Mongoose } from 'mongoose';
import Note from './schemas/note.schema';
import { Constants } from 'src/constants/constants';

export const notesProviders = [
  {
    provide: Constants.note,
    useFactory: (mongoose: Mongoose) => Note,
    inject: [Constants.db],
  },
];
