import { Module } from '@nestjs/common';
import { BaseSettingsService } from './base-settings.service';
import { BaseSettingsResolver } from './base-settings.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseSettings, BaseSettingsSchema } from './entities/base-setting.entity';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis } from 'ioredis';

@Module({
  imports: [MongooseModule.forFeature([{ name: BaseSettings.name, schema: BaseSettingsSchema }])],
  providers: [
    BaseSettingsResolver,
    BaseSettingsService,
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
    },
  ],
  exports: [BaseSettingsService],
})
export class BaseSettingsModule {}
