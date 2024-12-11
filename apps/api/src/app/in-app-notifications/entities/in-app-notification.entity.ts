
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { ReturnPaginationData } from '../../_core/helpers/functions';
import { Auth } from '../../auth/entities/auth.entity';

export type InAppNotificationDocument = InAppNotification & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
@ObjectType()
export class InAppNotification {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  @Prop()
  icon: string;

  @Field({ nullable: true })
  @Prop()
  image: string;

  @Field({ nullable: true })
  @Prop()
  title: string;

  @Field({ nullable: true })
  @Prop()
  description: string;

  @Field({ nullable: true })
  @Prop()
  time: string;

  @Field(() => [String], { nullable: true })
  @Prop([String])
  read: string[];

  @Field({ nullable: true })
  @Prop()
  link: string;

  @Field({ nullable: true })
  @Prop()
  useRouter: boolean;

  @Field({ nullable: true })
  @Prop()
  type: string;

  @Field({ nullable: true })
  createdAt: Date;

  @Field(() => [String], { nullable: true })
  @Prop([String])
  user: string[];





}

export const InAppNotificationSchema = SchemaFactory.createForClass(InAppNotification);



@ObjectType('InAppNotificationPagination')
export class InAppNotificationPagination {

  @Field({ nullable: true })
  pagination: ReturnPaginationData

  @Field(type => [InAppNotification], { nullable: true })
  items: InAppNotification[]


}
