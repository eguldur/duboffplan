import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Roles } from '../../admin/roles/entities/role.entity';
//import { Roles } from '../../admin/roles/entities/role.entity';


export type AuthDocument = Auth & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
@ObjectType('Auth')
export class Auth {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  @Prop()
  firstname: string;

  @Field({ nullable: true })
  @Prop()
  lastname: string;

  @Field({ nullable: true })
  @Prop({unique: true})
  email: string;

  @Field({ nullable: true })
  @Prop()
  password: string;

  @Field({ nullable: true })
  @Prop({default: false})
  isActive:  boolean;

  @Field({ nullable: true })
  @Prop({default: false })
  isEmailActive:  boolean;

  @Prop()
  emailActivateToken: string;

  @Field({ nullable: true })
  @Prop()
  avatar: string;

  @Field({ nullable: true })
  @Prop()
  headerPic: string;

  @Prop()
  emailActivateTokenDate:  Date;

  @Field({ nullable: true })
  @Prop()
  about:  string;

  @Prop()
  title:  string;

  @Field({ nullable: true })
  @Prop()
  phone:  string;

  @Prop()
  address:  string;

  @Prop()
  resetPassToken: string;

  @Prop()
  resetPassTokenDate:  Date;

  @Field(() => Roles, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Roles' })
  role: Roles;
  

  @Field({ nullable: true })
  fullname: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);