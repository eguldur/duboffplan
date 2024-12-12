import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { ReturnPaginationData } from '../../_core/helpers/functions';
import { BaseSettings } from '../../settings/basesettings/entities/base-setting.entity';
import { Developer, Phone, SocialMediaAccount } from '../../developer/entities/developer.entity';
import { Project } from '../../project/entities/project.entity';


export type CitizenDocument = Citizen & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
@ObjectType()
export class Citizen {
  @Field({ nullable: true })
  id: string;


  @Field({ nullable: true })
  @Prop()
  fullName: string;

  @Field(() => String, { nullable: true })
  @Prop()
  email: string;

  @Field(() => [Phone], { nullable: true })
  @Prop([{ type: Phone }])
  phone: Phone[];

  @Field(() => [SocialMediaAccount], { nullable: true })
  @Prop([{ type: SocialMediaAccount }])
  socialMediaAccounts?: SocialMediaAccount[];

  @Field(() => BaseSettings, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BaseSettings' })
  unvan: BaseSettings;

  @Field(() => [Developer], { nullable: true })
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Developer' }])
  developer: Developer[];

  @Field(() => [Project], { nullable: true })
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }])
  project: Project[];

  @Field({ nullable: true })
  @Prop({ index: true })
  type: string;

  @Field({ nullable: true })
  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  searchtext: string;

  @Field({ nullable: true })
  @Prop()
  avatar: string;

}

export const CitizenSchema = SchemaFactory.createForClass(Citizen);

@ObjectType('CitizenPagination')
export class CitizenPagination {
  @Field({ nullable: true })
  pagination: ReturnPaginationData;

  @Field((type) => [Citizen], { nullable: true })
  items: Citizen[];
}
