import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { ReturnPaginationData } from '../../_core/helpers/functions';
import { BaseSettings } from '../../settings/basesettings/entities/base-setting.entity';


@ObjectType('GeoPoint')
export class GeoPoint {
  @Field({ nullable: true })
  @Prop()
  type: string;

  @Field((type) => [Number], { nullable: true })
  @Prop()
  coordinates: number[];
}

@ObjectType()
export class SocialMediaAccount {
  @Field(() => BaseSettings, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BaseSettings' })
  platform: BaseSettings;

  @Field()
  @Prop()
  username: string;
}

@Schema()
@ObjectType()
export class Phone {
  @Field(() => BaseSettings, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BaseSettings' })
  phoneType: BaseSettings;

  @Field()
  @Prop()
  phone: string;
}


export type DeveloperDocument = Developer & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
@ObjectType()
export class Developer {
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

  @Field(() => [Phone], { nullable: true })
  @Prop([{ type: Phone }])
  phone: Phone[];

  @Field(() => [SocialMediaAccount], { nullable: true })
  @Prop([{ type: SocialMediaAccount }])
  socialMediaAccounts?: SocialMediaAccount[];

  @Field({ nullable: true })
  @Prop()
  phone_dld: string;

  @Field({ nullable: true })
  @Prop()
  email: string;

  @Field({ nullable: true })
  @Prop()
  email_dld: string;

  @Field({ nullable: true })
  @Prop()
  address: string;

  @Field({ nullable: true })
  @Prop()
  address_dld: string;

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

}

export const DeveloperSchema = SchemaFactory.createForClass(Developer);

@ObjectType('DeveloperPagination')
export class DeveloperPagination {
  @Field({ nullable: true })
  pagination: ReturnPaginationData;

  @Field((type) => [Developer], { nullable: true })
  items: Developer[];
}
