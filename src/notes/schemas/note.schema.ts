import * as mongoose from 'mongoose';
import {  softDelete } from '../../helpers/database/structure.js';

const IDTYPE = mongoose.Schema.Types.ObjectId;

const NoteSchema = new mongoose.Schema({
  user_id: { type: IDTYPE, index: true, ref: 'User' }, // note owner
  title: { type: String, max: 255 },
  content: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date, default: Date.now }
});

NoteSchema.plugin(softDelete, { deletedAt: true, overrideMethods: true, indexFields: ['deleted', 'deletedAt'] });

const Note = mongoose.model('Note', NoteSchema);

export default Note;
