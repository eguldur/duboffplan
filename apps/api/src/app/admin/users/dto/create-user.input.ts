import { InputType, Int, Field } from '@nestjs/graphql'

@InputType()
export class CreateUserInput {
  @Field({ nullable: true })
  firstname: string;

  @Field({nullable: true})
  lastname: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  isActive: boolean;

  @Field({ nullable: true })
  isEmailActive: boolean;

  @Field({ nullable: true })
  role: string;
}
