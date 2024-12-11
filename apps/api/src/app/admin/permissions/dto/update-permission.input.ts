import { CreatePermissionInput } from './create-permission.input'
import { InputType, Field, PartialType } from '@nestjs/graphql'

@InputType('updatePermissionInput')
export class UpdatePermissionInput extends PartialType(CreatePermissionInput) {
  @Field({ nullable: true})
  id: string;

  @Field(() => [String], {nullable: true})
  updateIds: string[];
}
