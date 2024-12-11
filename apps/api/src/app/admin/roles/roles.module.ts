import { Module } from '@nestjs/common'
import { RolesService } from './roles.service'
import { RolesResolver } from './roles.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { Roles, RolesSchema } from './entities/role.entity'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Roles.name, schema: RolesSchema },
    ]),
  ],
  providers: [RolesResolver, RolesService],
})
export class RolesModule {}
