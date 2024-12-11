import { CreateBasesettingInput } from './create-base-setting.input'
import { InputType, Field, PartialType } from '@nestjs/graphql'

@InputType('updateBasesettingInput')
export class UpdateBasesettingInput extends PartialType(CreateBasesettingInput) {
  @Field({nullable: true})
  id: string;

  @Field(() => [String], {nullable: true})
  updateIds: string[];
}
