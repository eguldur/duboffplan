import { CreateNoteInput } from './create-note.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType('updateNoteInput')
export class UpdateNoteInput extends PartialType(CreateNoteInput) {
  @Field(() => String)
  id: string;
}
