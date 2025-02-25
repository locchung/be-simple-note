import * as mongoose from 'mongoose';
import {  softDelete } from '../../helpers/database/structure';
import RegexHelper from 'src/helpers/regex';

const IDTYPE = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
  username: { type: String, index: true, unique: true, max: 255 },
  password: { type: String, max: 255 },
  salt: { type: String },
  full_name: { type: String, max: 255 },
  email: { type: String, trim: true, index: true, unique: true, max: 255, sparse: true },
  avatar: { type: String, trim: true, sparse: true },
  google_user_id: { type: String, max: 255, default: '' },
  created_at: { type: Date },
  updated_at: { type: Date, default: Date.now },
  last_login: { type: Date },
  notes: [{ type: IDTYPE, ref: 'Note' }]
});

UserSchema.plugin(softDelete, { deletedAt: true, overrideMethods: true, indexFields: ['deleted', 'deletedAt'] });

const User = mongoose.model('User', UserSchema);
User.schema.path('email').validate(value => RegexHelper.regexEmail().test(value), 'Invalid email');

export default User;
