import { Field, InputType } from '@nestjs/graphql';

  
@InputType()
export class LoginDto {
  @Field(() => String)
  readonly email: string;

  @Field(() => String)
  readonly password: string;
}