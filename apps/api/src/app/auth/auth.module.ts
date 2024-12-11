import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UploadFromBase64Service } from '../_core/services/upload-from-base-64.service';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (
        {
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: (3600 * 24 * 7),
        },
      }),
    }),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy, UploadFromBase64Service
  ],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
