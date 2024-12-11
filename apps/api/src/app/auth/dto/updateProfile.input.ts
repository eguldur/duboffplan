import { Field, InputType } from '@nestjs/graphql';

  
@InputType('updateProfileDto')
export class updateProfileDto {
    @Field(() => String, { nullable: true })
    readonly firstname: string;
  
    @Field(() => String, { nullable: true })
    readonly lastname: string;

    @Field(() => String, { nullable: true })
    readonly title: string;

    @Field(() => String, { nullable: true })
    readonly about: string;

    @Field(() => String, { nullable: true })
    readonly phone: string;

    @Field(() => String, { nullable: true })
    readonly address: string;

    @Field(() => String, { nullable: true })
    avatar: string;

    @Field(() => String, { nullable: true })
    headerPic: string;

}