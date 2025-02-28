import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotesService } from './notes.service';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateNoteDto } from './dto/create-note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createNote(@Request() req, @Body() createNote: {title: string, content: string}) {
    const userId = req.user.userId;
    const { title, content } = createNote;

    const createNoteDto: CreateNoteDto = {
      title,
      content,
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
    }
    return await this.notesService.create(createNoteDto);
  }

  @Get('/search')
  @UseGuards(JwtAuthGuard)
  async searchNotes(@Request() req) {
    const userId = req.user.userId;
    const query = req.query.querySearch;
    return await this.notesService.searchNotes(query, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserNotes(@Request() req) {
    const userId = req.user.userId;
    return await this.notesService.findUserNotes(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    const userId = req.user.userId;
    return await this.notesService.update(id, userId, updateNoteDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req, @Param('id') id: string) {
    const userId = req.user.userId;
    await this.notesService.remove(id, userId)
    return;
  }
}
