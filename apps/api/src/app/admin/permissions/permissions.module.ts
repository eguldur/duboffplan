import { Module } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { PermissionsResolver } from './permissions.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { Permissions, PermissionsSchema } from './entities/permission.entity'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permissions.name, schema: PermissionsSchema },
    ]),
  ],
  providers: [PermissionsResolver, PermissionsService],
})
export class PermissionsModule {}
