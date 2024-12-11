import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBasesettingInput {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  siraNo: number;

  @Field({ nullable: true })
  isActive: boolean;

  @Field({ nullable: true })
  basekat: string;

  @Field({ nullable: true })
  startDate: Date;

  @Field({ nullable: true })
  endDate: Date;
}

@InputType('createMultiBaseSettingsInput')
export class CreateMultiBaseSettingsInput {
  @Field(() => [CreateBasesettingInput], { nullable: true })
  data: CreateBasesettingInput[];
}
