import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import mongoose, { Model } from 'mongoose';
import { Note } from './interfaces/note.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NotesService {
  constructor(@Inject('NOTE_MODEL') private readonly noteModel: Model<Note>, private userService: UsersService) {}

  async create(createNoteDto: CreateNoteDto) {
    // validate the incoming data
    const user = await this.userService.findOne(createNoteDto.user_id);
    if (!user) throw new NotFoundException('User not found');

    // create a new note
    const newNote = await this.noteModel.create(createNoteDto);
    return newNote;
  }

  findAll() {
    return `This action returns all notes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  async update(id: string, userId: string, updateNoteDto: UpdateNoteDto) {
    // validate the incoming data
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const note = await this.noteModel.findById(id);
    if (!note) throw new NotFoundException('Note not found');

    if (note.user_id != (userId)) throw new NotFoundException('Note not found');

    const updatedNote = await this.noteModel.findByIdAndUpdate({ _id: id }, {
      title: updateNoteDto.title,
      content: updateNoteDto.content,
      updated_at: new Date()
    })

    return updatedNote;
  }

  async remove(id: string, userId: string) {
    // validate the incoming data
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const note = await this.noteModel.findById(id);
    if (!note) throw new NotFoundException('Note not found');

    if (note.user_id != (userId)) throw new NotFoundException('Note not found');

    await this.noteModel.deleteOne({ _id: id });

    return;
  }

  async findUserNotes(userId: string) {
    const notes = await this.noteModel.find({ user_id: userId });

    return notes;
  }

  async searchNotes(query: string, userId: string) {
    // const notes = await this.noteModel.find({
    //   user_id: userId,
    //   $text: { $search: query }
    // });

    const regex = new RegExp(query, 'i'); // 'i' for case-insensitive

    const notes = await this.noteModel.find({
      user_id: userId,
      $or: [
        { title: { $regex: regex } },
        { content: { $regex: regex } }
      ]
    });

    return notes;
  }
}
