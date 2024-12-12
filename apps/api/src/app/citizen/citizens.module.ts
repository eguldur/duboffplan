import { Module } from '@nestjs/common';
import { CitizenService } from './citizens.service';
import { CitizenResolver} from './citizens.resolver';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Citizen, CitizenSchema } from './entities/citizen.entity';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis } from 'ioredis';
import { BaseSettingsModule } from '../settings/basesettings/base-settings.module';
import { UploadFromBase64Service } from '../_core/services/upload-from-base-64.service';

@Module({
  imports: [
    BaseSettingsModule,
    MongooseModule.forFeature([{ name: Citizen.name, schema: CitizenSchema }]),
  ],
  providers: [
    CitizenResolver,
    CitizenService,
    UploadFromBase64Service,
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
})
export class CitizenModule {}
