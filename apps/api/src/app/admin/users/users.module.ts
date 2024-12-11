import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersResolver } from './users.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { Auth, AuthSchema } from '../../auth/entities/auth.entity'
import { Roles, RolesSchema } from '../roles/entities/role.entity'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
      { name: Roles.name, schema: RolesSchema },

    ]),
  ],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
