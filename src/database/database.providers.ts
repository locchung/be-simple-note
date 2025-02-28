
import * as mongoose from 'mongoose';
import { config } from 'src/config';
import { Constants } from 'src/constants/constants';

export const databaseProviders = [
  {
    provide: Constants.db,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(config.mongoUri),
  },
];
