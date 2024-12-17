import { InputType, Int, Field } from '@nestjs/graphql';
import { FileInput } from '../../fileserver/entities/fileserver.entity';

@InputType('socialMediaAccountInput')
export class SocialMediaAccountInput {
  @Field({ nullable: true })
  platform: string;

  @Field({ nullable: true })
  username: string;
}

@InputType('phoneInput')
export class PhoneInput {
  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  phoneType: string;
}


@InputType('GeoPointObjInput')
export class GeoPointObjInput {
  @Field(() => String)
  type: string;

  @Field(() => [Number])
  coordinates: number[];
}

@InputType()
export class CreateDeveloperInput {
 
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  title_dld: string;

  @Field({ nullable: true })
  dldId: number;

  @Field(() => [PhoneInput], { nullable: true })
  phone: PhoneInput[];

  @Field(() => [SocialMediaAccountInput], { nullable: true })
  socialMediaAccounts: SocialMediaAccountInput[];

  @Field({ nullable: true })
  email: string;

  @Field(() => [FileInput], { nullable: true })
  files: FileInput[];

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  phone_dld: string;

  @Field({ nullable: true })
  email_dld: string;

  @Field({ nullable: true })
  address_dld: string;

  @Field({ nullable: true })
  website: string;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  isActive: boolean;

  @Field(() => GeoPointObjInput, { nullable: true })
  location: GeoPointObjInput;

  @Field({ nullable: true })
  logo: string;
}
