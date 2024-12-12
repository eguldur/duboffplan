import { InputType, Int, Field } from '@nestjs/graphql';
import { GeoPointObjInput, PhoneInput, SocialMediaAccountInput } from '../../developer/dto/create-developer.input';

@InputType('projectUnitsDLDInput')
export class ProjectUnitsDLDInput {
  @Field({ nullable: true })
  usagetype: string;

  @Field({ nullable: true })
  propertytype: string;

  @Field({ nullable: true })
  units: number;
}
@InputType()
export class CreateProjectInput {
  
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  title_dld: string;

  @Field({ nullable: true })
  dldId: number;

  @Field({ nullable: true })
  units_dld: number;

  @Field({ nullable: true })
  registedAt_dld: Date;

  @Field({ nullable: true })
  startedAt_dld: Date;

  @Field({ nullable: true })
  finishedAt_dld: Date;

  @Field({ nullable: true })
  area_dld: number;

  @Field(() => [PhoneInput], { nullable: true })
  phone: PhoneInput[];

  @Field(() => [SocialMediaAccountInput], { nullable: true })
  socialMediaAccounts?: SocialMediaAccountInput[];

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  address: string;

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

  @Field(() => [ProjectUnitsDLDInput], { nullable: true })
  projectUnits_dld: ProjectUnitsDLDInput[];
}
