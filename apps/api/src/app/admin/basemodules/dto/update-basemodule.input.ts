import { CreateBasemoduleInput } from './create-basemodule.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType('updateBasemoduleInput')
export class UpdateBasemoduleInput extends PartialType(CreateBasemoduleInput) {
  @Field({nullable: true})
  id: string;

  @Field(() => [String], {nullable: true})
  updateIds: string[];
}
