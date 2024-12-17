import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Auth } from '../../auth/entities/auth.entity';
import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FileObj } from '../../fileserver/entities/fileserver.entity';
import { Developer } from '../../developer/entities/developer.entity';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
@ObjectType()
export class Note {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  content: string;

  @Field(() => Auth)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Auth' })
  user: Auth;

  @Field(() => [FileObj], { nullable: true })
  @Prop([{ type: FileObj }])
  files: FileObj[];

  @Field(() => Developer)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Developer' })
  developer: Developer;

  @Field({ nullable: true })
  updatedAt: Date;

  @Field({ nullable: true })
  createdAt: Date;
}




export const NoteSchema = SchemaFactory.createForClass(Note);