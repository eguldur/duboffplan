import { InputType, Int, Field } from '@nestjs/graphql';
import { PhoneInput, SocialMediaAccountInput } from '../../developer/dto/create-developer.input';

@InputType()
export class CreateCitizenInput {

  @Field({ nullable: true })
  fullName: string;

  @Field({ nullable: true })
  basekat: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => [PhoneInput], { nullable: true })
  phone: PhoneInput[];

  @Field(() => [SocialMediaAccountInput], { nullable: true })
  socialMediaAccounts: SocialMediaAccountInput[];

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  isActive: boolean;

  @Field(() => [String], { nullable: true })
  developer: string[];

  @Field(() => [String], { nullable: true })
  project: string[];

  @Field({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  unvan: string;
}

@InputType('createMultiCitizenInput')
export class CreateMultiCitizenInput {
  @Field(() => [CreateCitizenInput], { nullable: true })
  data: CreateCitizenInput[];
}
