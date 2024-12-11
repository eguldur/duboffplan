import { Module } from '@nestjs/common';
import { InAppNotificationsService } from './in-app-notifications.service';
import { InAppNotificationsResolver } from './in-app-notifications.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { InAppNotification, InAppNotificationSchema } from './entities/in-app-notification.entity';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis } from 'ioredis';

@Module({
  imports: [MongooseModule.forFeature([{ name: InAppNotification.name, schema: InAppNotificationSchema }])],
  providers: [InAppNotificationsResolver, InAppNotificationsService,
    {
      provide: 'PUB_SUB',
      useFactory: async (configService: ConfigService) => {
        const options = {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          auth: configService.get('REDIS_USERNAME'),
          password: configService.get('REDIS_PASSWORD'),

        };
    
        return new RedisPubSub({
          publisher: new Redis(options),
          subscriber: new Redis(options),
        });
        
      },
      inject: [ConfigService],
    }
  ],
  exports: [InAppNotificationsService]
})
export class InAppNotificationsModule {}
