import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AdminModule } from './admin/admin.module';
import { Context } from 'graphql-ws';
import { JwtService } from '@nestjs/jwt';
import { InAppNotificationsModule } from './in-app-notifications/in-app-notifications.module';
import { SettingsModule } from './settings/settings.module';
import { FileserverModule } from './fileserver/fileserver.module';
import { DeveloperModule } from './developer/developer.module';
import { McompanyModule } from './mcompany/mcompany.module';
import { ProjectModule } from './project/project.module';
import { CitizenModule } from './citizen/citizens.module';

const jwt = new JwtService();

@Module({
  imports: [
    CacheModule.register({
      ttl: 5, // seconds
      max: 10, // maximum number of items in cache
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        connectionFactory: (connection) => {
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': {
          onConnect: (context: Context<any>) => {
            console.log('onConnect');
          },
          onDisconnect: (context: Context<any>) => {
            console.log('onDisconnect');
          },
        },
      },
      playground: false,
      introspection: false,
      persistedQueries: {
        ttl: 900,
      },
      autoSchemaFile: true,
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'img', 'uploads'),
    }),

    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_SERVER'),
          secure: true,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"${config.get('MAIL_FROM_NAME')}" <${config.get(
            'MAIL_FROM_MAIL',
          )}>`,
        },
        template: {
          dir: join(__dirname, '/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    AuthModule,
    AdminModule,
    InAppNotificationsModule,
    SettingsModule,
    FileserverModule,
    DeveloperModule,
    McompanyModule,
    ProjectModule,
    CitizenModule,
  ],
})
export class AppModule {}
