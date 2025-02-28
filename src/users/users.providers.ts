import { Mongoose } from 'mongoose';
import User from './schemas/user.schema';
import { Constants } from 'src/constants/constants';

export const usersProviders = [
  {
    provide: Constants.user,
    useFactory: (mongoose: Mongoose) => User,
    inject: [Constants.db],
  },
];
