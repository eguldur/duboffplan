import { InputType, Int, Field } from '@nestjs/graphql';
import { FileInput } from '../../fileserver/entities/fileserver.entity';

@InputType('createNoteInput')
export class CreateNoteInput {
  @Field(() => String)
  content: string;

  @Field(() => String)
  developer: string;

  @Field(() => [FileInput], { nullable: true })
  files: FileInput[];
}
