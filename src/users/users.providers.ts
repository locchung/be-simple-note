import { Mongoose } from 'mongoose';
import User from './schemas/user.schema';

export const usersProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (mongoose: Mongoose) => User,
    inject: ['DATABASE_CONNECTION'],
  },
];
