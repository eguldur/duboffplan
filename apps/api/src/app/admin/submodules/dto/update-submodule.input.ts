import { CreateSubmoduleInput } from './create-submodule.input'
import { InputType, Field, Int, PartialType } from '@nestjs/graphql'

@InputType('updateSubmoduleInput')
export class UpdateSubmoduleInput extends PartialType(CreateSubmoduleInput) {
  @Field({ nullable: true})
  id: string;

  @Field(() => [String], {nullable: true})
  updateIds: string[];
}

