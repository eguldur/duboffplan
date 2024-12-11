import { Inject, Injectable } from '@nestjs/common';
import { CreateInAppNotificationInput } from './dto/create-in-app-notification.input';
import { UpdateInAppNotificationInput } from './dto/update-in-app-notification.input';
import { InAppNotification } from './entities/in-app-notification.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PubSubEngine } from 'graphql-subscriptions';

const NEW_IN_APP_NOTIFICATION_SUB = 'newInAppNotificationSub';

@Injectable()
export class InAppNotificationsService {
  constructor(@InjectModel(InAppNotification.name) private inAppNotificationModel: Model<InAppNotification>,
    @Inject('PUB_SUB') private _pubSub: PubSubEngine
  ) {}

  async create(input: CreateInAppNotificationInput, _data: any) {
    const inAppNotification = await this.inAppNotificationModel.create({ ...input, user: [_data.id] });
    this._pubSub.publish(NEW_IN_APP_NOTIFICATION_SUB, { [NEW_IN_APP_NOTIFICATION_SUB]: inAppNotification });
    return inAppNotification;
  }

  async createForUsers(input: CreateInAppNotificationInput, userIds: string[]) {
    const inAppNotification = await this.inAppNotificationModel.create({ ...input, user: userIds });
    this._pubSub.publish(NEW_IN_APP_NOTIFICATION_SUB, { [NEW_IN_APP_NOTIFICATION_SUB]: inAppNotification });
    return inAppNotification;
  }

  async findAll(_data: any) {
    return this.inAppNotificationModel.find({ user: _data.id }).sort({ createdAt: -1 }).limit(10);
  }
}
