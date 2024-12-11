import { Module } from '@nestjs/common';
import { McompanyService } from './mcompany.service';
import { McompanyResolver } from './mcompany.resolver';
import { MCompany, MCompanySchema } from './entities/mcompany.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis } from 'ioredis';

@Module({
  imports: [MongooseModule.forFeature([{ name: MCompany.name, schema: MCompanySchema }])],
  providers: [McompanyResolver, McompanyService,
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
  ]
})
export class McompanyModule {}
