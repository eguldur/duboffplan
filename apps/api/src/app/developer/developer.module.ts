import { Module } from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { DeveloperResolver, PhoneResolver, SocialMediaAccountResolver } from './developer.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Developer, DeveloperSchema } from './entities/developer.entity';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis } from 'ioredis';
import { BaseSettingsService } from '../settings/basesettings/base-settings.service';
import { BaseSettingsModule } from '../settings/basesettings/base-settings.module';
import { UploadFromBase64Service } from '../_core/services/upload-from-base-64.service';
@Module({
  imports: [BaseSettingsModule,
  MongooseModule.forFeature([{ name: Developer.name, schema: DeveloperSchema }])],
  providers: [DeveloperResolver, DeveloperService, PhoneResolver, SocialMediaAccountResolver, UploadFromBase64Service,
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
    }],
})
export class DeveloperModule {}
