import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ReturnPaginationData } from '../../../_core/helpers/functions';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { BaseModules } from '../../basemodules/entities/basemodule.entity';
import { SubModules } from '../../submodules/entities/submodule.entity';

export type PermissionsDocument = Permissions & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
@ObjectType()
export class Permissions {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  @Prop({default: ''})
  title: string;

  @Field({ nullable: true })
  @Prop({default: 999})
  permId: number;

  @Field(type => BaseModules, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BaseModules' })
  basemodule: BaseModules;

  @Field(type => SubModules, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'SubModules' })
  submodule: SubModules;
  
  @Field({ nullable: true })
  @Prop({default: false})
  isActive: boolean;
}

export const PermissionsSchema = SchemaFactory.createForClass(Permissions);



@ObjectType('PermissionsPagination')
export class PermissionsPagination {

  @Field({ nullable: true })
  pagination: ReturnPaginationData

  @Field(type => [Permissions], { nullable: true })
  items: Permissions[]


}
