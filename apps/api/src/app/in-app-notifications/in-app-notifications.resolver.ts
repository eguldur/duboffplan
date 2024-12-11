import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { InAppNotificationsService } from './in-app-notifications.service';
import { InAppNotification } from './entities/in-app-notification.entity';
import { CreateInAppNotificationInput } from './dto/create-in-app-notification.input';
import { UpdateInAppNotificationInput } from './dto/update-in-app-notification.input';
import { PubSubEngine } from 'graphql-subscriptions';
import { Inject, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/jwt/current-user.decorators';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

const NEW_IN_APP_NOTIFICATION_SUB = 'newInAppNotificationSub';
const NAME = 'InAppNotification';

@UseGuards(JwtAuthGuard)
@Resolver(() => InAppNotification)
export class InAppNotificationsResolver {
  constructor(
    private readonly inAppNotificationsService: InAppNotificationsService,
    @Inject('PUB_SUB') private _pubSub: PubSubEngine
  ) {}

  @Subscription(returns => InAppNotification, {
    filter: (payload, variables, context) => payload[NEW_IN_APP_NOTIFICATION_SUB].user.includes(context.req.user.id) && payload[NEW_IN_APP_NOTIFICATION_SUB].type === variables.type,
    name: NEW_IN_APP_NOTIFICATION_SUB,
  })
  subscribe(@Args('type') type: string, @CurrentUser() _data: any) {    
    return this._pubSub.asyncIterator(NEW_IN_APP_NOTIFICATION_SUB);
  }

  @Query(() => [InAppNotification], { name: `${NAME}s` })
  findAllInAppNotifications(@CurrentUser() _data: any) {
    return this.inAppNotificationsService.findAll(_data);
  }


 
}
