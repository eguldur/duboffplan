import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMcompanyInput {
 
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  dldId: number;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  mobile: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  isActive: boolean;
}