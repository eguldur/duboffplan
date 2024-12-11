import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';
import { Type } from 'class-transformer';
import { ReturnPaginationData } from '../../../_core/helpers/functions';

export type BaseModulesDocument = BaseModules & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true, getters: true } })
@ObjectType()
export class BaseModules {


  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  @Prop({default: ''})
  title: string;

  @Field({ nullable: true })
  @Prop({default: ''})
  subtitle: string;

  @Field({ nullable: true })
  @Prop({default: 'collapsable'})
  type: string;

  @Field({ nullable: true })
  @Prop({default: 'heroicons_outline:bookmark'})
  icon: string;

  @Field({ nullable: true })
  @Prop({default: 999})
  siraNo: number;

  @Field({ nullable: true })
  @Prop({default: false})
  isActive: boolean;


}

const BaseModulesSchema = SchemaFactory.createForClass(BaseModules);
export {BaseModulesSchema}

@ObjectType('BaseModulesPagination')
export class BaseModulesPagination {

  @Field({ nullable: true })
  pagination: ReturnPaginationData

  @Field(type => [BaseModules], { nullable: true })
  items: BaseModules[]
}