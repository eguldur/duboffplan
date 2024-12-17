import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';
import { CreateNoteInput } from './dto/create-note.input';
import { UpdateNoteInput } from './dto/update-note.input';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CurrentUser } from '../auth/jwt/current-user.decorators';
import { UseGuards } from '@nestjs/common';
import { ReturnIsOkData } from '../_core/helpers/functions';


@UseGuards(JwtAuthGuard)
@Resolver(() => Note)
export class NotesResolver {
  constructor(private readonly notesService: NotesService) {}

  @Mutation(() => Note)
  async createNote(@Args('createNoteInput') createNoteInput: CreateNoteInput, @CurrentUser() _data: any) {
    return this.notesService.create(createNoteInput, _data);
  }

  @Query(() => [Note])
  async developerNotes(@Args('developerId') developerId: string, @CurrentUser() _data: any) {
    return this.notesService.getNotesByDeveloper(developerId, _data);
  }

  @Mutation(() => ReturnIsOkData)
  async deleteNote(@Args('id') id: string, @CurrentUser() _data: any) {
    return this.notesService.delete(id, _data);
  }
}
