import { Injectable } from '@nestjs/common';
import { CreateNoteInput } from './dto/create-note.input';
import { UpdateNoteInput } from './dto/update-note.input';
import { Auth } from '../auth/entities/auth.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Note } from './entities/note.entity';
import { Model } from 'mongoose';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
  ) {}

  async create(createNoteInput: CreateNoteInput, user: Auth) {
    const note = new this.noteModel({
      ...createNoteInput,
      user: user.id,
    });
    await note.save();

    const returnNote = await this.noteModel.findById(note.id).populate('user');

    return returnNote;
  }

  async getNotesByDeveloper(developerId: string, user: Auth) {
    const notes = await this.noteModel.find({ developer: developerId }).populate('user');
    return notes;
  }

  async delete(id: string, user: Auth) {
    await this.noteModel.findByIdAndDelete(id);
    return { isOk: 'ok' };
  }
}
