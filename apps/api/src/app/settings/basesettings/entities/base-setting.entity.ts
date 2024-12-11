import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { ReturnPaginationData } from '../../../_core/helpers/functions';

export type BaseSettingsDocument = BaseSettings & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
@ObjectType()
export class BaseSettings {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  @Prop()
  title: string;

  @Field({ nullable: true })
  @Prop()
  siraNo: number;

  @Field({ nullable: true })
  @Prop({ index: true })
  type: string;

  @Field({ nullable: true })
  @Prop({ default: false })
  isActive: boolean;


  @Field((type) => BaseSettings, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BaseSettings', index: true })
  basekat: BaseSettings;

  @Field({ nullable: true })
  @Prop()
  startDate: string;

  @Field({ nullable: true })
  @Prop()
  endDate: string;
}

export const BaseSettingsSchema = SchemaFactory.createForClass(BaseSettings);

@ObjectType('BaseSettingsPagination')
export class BaseSettingsPagination {
  @Field({ nullable: true })
  pagination: ReturnPaginationData;

  @Field((type) => [BaseSettings], { nullable: true })
  items: BaseSettings[];
}
