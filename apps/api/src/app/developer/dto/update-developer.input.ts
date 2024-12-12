import { CreateDeveloperInput } from './create-developer.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType('updateDeveloperInput')
export class UpdateDeveloperInput extends PartialType(CreateDeveloperInput) {
  @Field({ nullable: true })
  id: string;
}
