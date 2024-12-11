import { CreateRoleInput } from './create-role.input'
import { InputType, Field, Int, PartialType } from '@nestjs/graphql'

@InputType('updateRoleInput')
export class UpdateRoleInput extends PartialType(CreateRoleInput) {
  @Field({ nullable: true})
  id: string;

  @Field(() => [String], {nullable: true})
  updateIds: string[];
}
