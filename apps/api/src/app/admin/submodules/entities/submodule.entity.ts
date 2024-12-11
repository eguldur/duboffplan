import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import mongoose, { Document } from 'mongoose';
import { BaseModules } from '../../basemodules/entities/basemodule.entity';
import { ReturnPaginationData } from '../../../_core/helpers/functions';
import { Permissions } from '../../permissions/entities/permission.entity';
export type SubModulesDocument = SubModules & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
@ObjectType()
export class SubModules {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  @Prop({default: ''})
  title: string;

  @Field({ nullable: true })
  @Prop({default: 'basic'})
  type: string;

  @Field({ nullable: true })
  @Prop({default: ''})
  link: string;

  @Field({ nullable: true })
  @Prop({default: 999})
  siraNo: number;

  @Field({ nullable: true })
  @Prop({default: false})
  isActive: boolean;

  @Field(type => BaseModules)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BaseModules' })
  basemodule: BaseModules;

  @Field(type => [Permissions])
  permissions: Permissions[];

}
export const SubModulesSchema = SchemaFactory.createForClass(SubModules);

@ObjectType('SubModulesPagination')
export class SubModulesPagination {

  @Field({ nullable: true })
  pagination: ReturnPaginationData

  @Field(type => [SubModules], { nullable: true })
  items: SubModules[]


}