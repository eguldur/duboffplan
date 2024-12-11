import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class NavigationSub {

  @Field({ nullable: true })
  _id: string;

  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  link: string;

  @Field({ nullable: true })
  siraNo: number;


}

@ObjectType()
export class NavigationBase {

  @Field({ nullable: true })
  _id: string;

  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  icon: string;

  @Field({ nullable: true })
  link: string;

  @Field({ nullable: true })
  siraNo: number;

  @Field(() => [NavigationSub], { nullable: true })
  children: NavigationSub[];

}
