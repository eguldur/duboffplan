import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { ReturnPaginationData } from '../../_core/helpers/functions';
import { BaseSettings } from '../../settings/basesettings/entities/base-setting.entity';
import { Developer, GeoPoint, Phone, SocialMediaAccount } from '../../developer/entities/developer.entity';
import { MCompany } from '../../mcompany/entities/mcompany.entity';



@ObjectType()
export class ProjectUnitsDLD {
  @Field(() => BaseSettings, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BaseSettings' })
  usagetype: BaseSettings;

  @Field(() => BaseSettings, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BaseSettings' })
  propertytype: BaseSettings;

  @Field(() => Number, { nullable: true })
  @Prop()
  units: number;
}

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
@ObjectType()
  export class Project {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  @Prop()
  title: string;

  @Field({ nullable: true })
  @Prop()
  description: string;

  @Field({ nullable: true })
  @Prop()
  title_dld: string;

  @Field({ nullable: true })
  @Prop()
  dldId: number;

  @Field({ nullable: true })
  @Prop()
  units_dld: number;

  @Field({ nullable: true })
  @Prop()
  bank_dld: string;

  @Field({ nullable: true })
  @Prop()
  bankaccount_dld: number;

  @Field({ nullable: true })
  @Prop()
  registedAt_dld: string;

  @Field({ nullable: true })
  @Prop()
  startedAt_dld: string;

  @Field({ nullable: true })
  @Prop()
  finishedAt_dld: string;

  @Field({ nullable: true })
  @Prop()
  area_dld: number;

  @Field(() => [Phone], { nullable: true })
  @Prop([{ type: Phone }])
  phone: Phone[];

  @Field(() => [SocialMediaAccount], { nullable: true })
  @Prop([{ type: SocialMediaAccount }])
  socialMediaAccounts?: SocialMediaAccount[];

  @Field({ nullable: true })
  @Prop()
  email: string;

  @Field({ nullable: true })
  @Prop()
  address: string;

  @Field({ nullable: true })
  @Prop()
  address_sale: string;

  @Field({ nullable: true })
  @Prop({ index: true })
  website: string;

  @Field({ nullable: true })
  @Prop({ index: true })
  type: string;

  @Field({ nullable: true })
  @Prop({ default: false })
  isActive: boolean;
  

  @Field(() => GeoPoint, { nullable: true })
  @Prop({ type: GeoPoint, index: '2dsphere' })
  location: GeoPoint;

  @Field(() => GeoPoint, { nullable: true })
  @Prop({ type: GeoPoint, index: '2dsphere' })
  location_sale: GeoPoint;

  @Field({ nullable: true })
  @Prop()
  logo: string;

  @Field(() => [ProjectUnitsDLD], { nullable: true })
  @Prop([{ type: ProjectUnitsDLD }])
  projectUnits_dld: ProjectUnitsDLD[];

  @Field(() => Developer, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Developer' })
  developer: Developer;

  @Field(() => MCompany, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'MCompany' })
  mcompany: MCompany;

}

export const ProjectSchema = SchemaFactory.createForClass(Project);

@ObjectType('ProjectPagination')
export class ProjectPagination {
  @Field({ nullable: true })
  pagination: ReturnPaginationData;

  @Field((type) => [Project], { nullable: true })
  items: Project[];
}
