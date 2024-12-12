import { CreateProjectInput } from './create-project.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType('updateProjectInput')
export class UpdateProjectInput extends PartialType(CreateProjectInput) {
  @Field(() => String, { nullable: true })
  id: string;
}
