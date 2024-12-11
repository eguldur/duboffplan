import { CreateUserInput } from './create-user.input'
import { InputType, Field, Int, PartialType } from '@nestjs/graphql'

@InputType('updateUserInput')
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field({ nullable: true})
  id: string;

  @Field(() => [String], {nullable: true})
  updateIds: string[];
}
