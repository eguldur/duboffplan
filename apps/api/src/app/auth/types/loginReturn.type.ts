import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType('UserData')
export class UserData {
    @Field({ nullable: true })
    id: string;
    @Field({ nullable: true })
    firstname: string;
    @Field({ nullable: true })
    lastname: string;
    @Field({ nullable: true })
    email:string;
    @Field({ nullable: true })
    isEmailActive: boolean;
    @Field({ nullable: true })
    avatar: string;
    @Field({ nullable: true })
    title: string;
    @Field({ nullable: true })
    about: string;
    @Field({ nullable: true })
    phone: string;
    @Field({ nullable: true })
    address: string;
    @Field({ nullable: true })
    name: string;
    @Field({ nullable: true })
    headerPic: string;
}

@ObjectType('LoginReturn')
export class LoginReturn {
  @Field({ nullable: true })
  accessToken: string;
  @Field({ nullable: true })
  tokenType: string;
  @Field(() => UserData, { nullable: true })
  user: UserData;
}