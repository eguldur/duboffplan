import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBasemoduleInput {
  @Field({nullable: true})
  title: string;

  @Field({nullable: true})
  subtitle: string;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  icon: string;

  @Field({ nullable: true })
  siraNo: number;

  @Field({ nullable: true })
  isActive: boolean;
}
