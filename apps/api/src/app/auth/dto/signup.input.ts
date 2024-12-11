import { Field, InputType } from '@nestjs/graphql';

  
@InputType()
export class SignUpDto {
  @Field(() => String)
  readonly email: string;
  
  @Field(() => String)
  readonly firstname: string;

  @Field(() => String)
  readonly lastname: string;

  @Field(() => String)
  readonly password: string;
}