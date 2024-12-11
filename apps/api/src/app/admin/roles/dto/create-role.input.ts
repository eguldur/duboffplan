import { InputType, Int, Field } from '@nestjs/graphql'

@InputType()
export class CreateRoleInput {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  isActive: boolean;

  @Field(type => [Number], { nullable: true })
  permissions?: number[];
}
