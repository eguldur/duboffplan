import { Module } from '@nestjs/common'
import { SubmodulesService } from './submodules.service'
import { SubmodulesResolver } from './submodules.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { SubModules, SubModulesSchema } from './entities/submodule.entity'
import { PermissionsService } from '../permissions/permissions.service'
import { Permissions, PermissionsSchema } from '../permissions/entities/permission.entity'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubModules.name, schema: SubModulesSchema },{ name: Permissions.name, schema: PermissionsSchema }
    ]),
  ],
  providers: [SubmodulesResolver, SubmodulesService, PermissionsService],
})
export class SubmodulesModule {}
