import { Module } from '@nestjs/common'
import { BasemodulesModule } from './basemodules/basemodules.module'
import { SubmodulesModule } from './submodules/submodules.module'
import { PermissionsModule } from './permissions/permissions.module'
import { RolesModule } from './roles/roles.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [BasemodulesModule, SubmodulesModule, PermissionsModule, RolesModule, UsersModule],
})
export class AdminModule {}
