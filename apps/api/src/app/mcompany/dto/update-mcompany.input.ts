import { CreateMcompanyInput } from './create-mcompany.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType('updateMCompanyInput')
export class UpdateMcompanyInput extends PartialType(CreateMcompanyInput) {
  @Field({ nullable: true })
  id: string;
}