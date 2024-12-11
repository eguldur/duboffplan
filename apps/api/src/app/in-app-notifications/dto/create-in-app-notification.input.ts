import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateInAppNotificationInput {
  @Field()
  icon: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  time: string;

  @Field()
  link: string;

  @Field()
  useRouter: boolean;

  @Field()
  type: string;

}
