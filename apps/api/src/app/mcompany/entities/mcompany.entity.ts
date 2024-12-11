import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { ReturnPaginationData } from '../../_core/helpers/functions';

export type MCompanyDocument = MCompany & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
@ObjectType()
export class MCompany {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  @Prop()
  title: string;

  @Field({ nullable: true })
  @Prop()
  dldId: number;

  @Field({ nullable: true })
  @Prop()
  phone: string;

  @Field({ nullable: true })
  @Prop()
  mobile: string;

  @Field({ nullable: true })
  @Prop()
  email: string;

  @Field({ nullable: true })
  @Prop()
  address: string;

  @Field({ nullable: true })
  @Prop({ index: true })
  type: string;

  @Field({ nullable: true })
  @Prop({ default: false })
  isActive: boolean;


}

export const MCompanySchema = SchemaFactory.createForClass(MCompany);

@ObjectType('MCompanyPagination')
export class MCompanyPagination {
  @Field({ nullable: true })
  pagination: ReturnPaginationData;

  @Field((type) => [MCompany], { nullable: true })
  items: MCompany[];
}
