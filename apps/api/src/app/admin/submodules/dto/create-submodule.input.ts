import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CreateSubmoduleInput {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  link: string;

  @Field({ nullable: true })
  siraNo: number;

  @Field({ nullable: true })
  isActive: boolean;

  @Field({ nullable: true })
  basemodule: string;

  @Field({ nullable: true })
  createPerm: boolean;
}