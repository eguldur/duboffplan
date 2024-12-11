import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Auth } from '../../auth/entities/auth.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

export type FSfolderDocument = FSfolder & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class FSfolder {
  @Prop({ default: '' })
  name: string;

  @Prop({ type: String, slug: 'name', slug_padding_size: 4, unique: true, slugOn: { findOneAndUpdate: true } })
  slug: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'FSfolder' })
  folderId: FSfolder;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Auth' })
  createdBy: Auth;

  @Prop({ default: 0 })
  size: number;

  @Prop({ default: 0 })
  contents: number;

  @Prop({ default: 0 })
  contentsf: number;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: 'Klasör' })
  type: string;
}
export const FSfolderSchema = SchemaFactory.createForClass(FSfolder);

export type FSfileDocument = FSfile & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class FSfile {
  @Prop({ default: '' })
  name: string;

  @Prop({ default: '' })
  fileLink: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'FSfolder' })
  folderId: FSfolder;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Auth' })
  createdBy: Auth;

  @Prop({ default: 0 })
  size: number;

  @Prop({ default: '' })
  type: string;

  @Prop({ default: '' })
  mimefirst: string;

  @Prop({ default: '' })
  mimesecond: string;

  createdAt: Date;
  updatedAt: Date;
}
export const FSfileSchema = SchemaFactory.createForClass(FSfile);

@ObjectType()
export class FileObj {
  @Field({ nullable: true })
  @Prop({ default: '' })
  name: string;

  @Field({ nullable: true })
  @Prop({ default: '' })
  fileLink: string;

  @Field({ nullable: true })
  @Prop({ default: 0 })
  size: number;

  @Field({ nullable: true })
  @Prop({ default: '' })
  type: string;

  @Field({ nullable: true })
  @Prop({ default: '' })
  mimefirst: string;

  @Field({ nullable: true })
  isPrivate?: boolean;
}

@InputType('FileInput')
export class FileInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  fileLink: string;

  @Field({ nullable: true })
  size: number;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  mimefirst: string;

  @Field({ nullable: true })
  isPrivate?: boolean;
}
