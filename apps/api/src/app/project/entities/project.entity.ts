import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { ReturnPaginationData } from '../../_core/helpers/functions';
import { BaseSettings } from '../../settings/basesettings/entities/base-setting.entity';
import { GeoPoint, Phone, SocialMediaAccount } from '../../developer/entities/developer.entity';



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
  registedAt_dld: Date;

  @Field({ nullable: true })
  @Prop()
  startedAt_dld: Date;

  @Field({ nullable: true })
  @Prop()
  finishedAt_dld: Date;

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

  @Field({ nullable: true })
  @Prop()
  logo: string;

  @Field(() => [ProjectUnitsDLD], { nullable: true })
  @Prop([{ type: ProjectUnitsDLD }])
  projectUnits_dld: ProjectUnitsDLD[];

}

export const ProjectSchema = SchemaFactory.createForClass(Project);

@ObjectType('ProjectPagination')
export class ProjectPagination {
  @Field({ nullable: true })
  pagination: ReturnPaginationData;

  @Field((type) => [Project], { nullable: true })
  items: Project[];
}
