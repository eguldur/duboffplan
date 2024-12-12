import { CreateCitizenInput } from './create-citizen.input'
import { InputType, Field, PartialType } from '@nestjs/graphql'

@InputType('updateCitizenInput')
export class UpdateCitizenInput extends PartialType(CreateCitizenInput) {
  @Field({nullable: true})
  id: string;

  @Field(() => [String], {nullable: true})
  updateIds: string[];
}
