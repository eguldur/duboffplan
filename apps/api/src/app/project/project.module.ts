import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { Project, ProjectSchema } from './entities/project.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseSettingsModule } from '../settings/basesettings/base-settings.module';
import { UploadFromBase64Service } from '../_core/services/upload-from-base-64.service';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis } from 'ioredis';

@Module({
  imports: [BaseSettingsModule, MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }])],
  providers: [ProjectResolver, ProjectService, UploadFromBase64Service,
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
export class ProjectModule {}