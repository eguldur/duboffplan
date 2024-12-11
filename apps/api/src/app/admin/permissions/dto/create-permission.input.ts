import { InputType, Int, Field } from '@nestjs/graphql'

@InputType()
export class CreatePermissionInput {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  basemodule: string;

  @Field({ nullable: true })
  submodule: string;

  @Field({ nullable: true })
  isActive: boolean;
}



