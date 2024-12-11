import { CreateInAppNotificationInput } from './create-in-app-notification.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateInAppNotificationInput extends PartialType(
  CreateInAppNotificationInput,
) {
  @Field(() => Int)
  id: number;
}
