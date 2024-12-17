import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesResolver } from './notes.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './entities/note.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
  ],
  providers: [NotesResolver, NotesService],
})
export class NotesModule {}
