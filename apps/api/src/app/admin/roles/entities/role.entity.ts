import { ReturnPaginationData } from '../../../_core/helpers/functions';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

export type RolesDocument = Roles & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
@ObjectType()
export class Roles {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  @Prop({default: ''})
  title: string;


  @Field(type => [Number], { nullable: true })
  @Prop({default: []})
  permissions: number[];

  @Field({ nullable: true })
  @Prop({default: false})
  isActive: boolean;

}

export const RolesSchema = SchemaFactory.createForClass(Roles);




@ObjectType('RolesPagination')
export class RolesPagination {

  @Field({ nullable: true })
  pagination: ReturnPaginationData

  @Field(type => [Roles], { nullable: true })
  items: Roles[]


}