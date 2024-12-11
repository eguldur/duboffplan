import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { PermissionsService } from './permissions.service'
import { Permissions, PermissionsPagination } from './entities/permission.entity'
import { CreatePermissionInput } from './dto/create-permission.input'
import { UpdatePermissionInput } from './dto/update-permission.input'
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard'
import { UseGuards } from '@nestjs/common'
import { FetchPaginationData, ReturnCauntData, ReturnIsOkData } from '../../_core/helpers/functions'
import { CurrentUser } from '../../auth/jwt/current-user.decorators'

@UseGuards(JwtAuthGuard)
@Resolver(() => Permissions)
export class PermissionsResolver {
  constructor(private readonly basemodulesService: PermissionsService) {}

  @Query((returns) => PermissionsPagination)
  async permissionPegination(@Args() args: FetchPaginationData, @CurrentUser({permId: [1004, 1005]}) _data: any) {
    return this.basemodulesService.getBaseModulesPagintaion(args)
  }
  @Query((returns) => ReturnCauntData)
  async permissionCount(@Args() args: FetchPaginationData, @CurrentUser({permId: [1004, 1005]}) _data: any) {
    return this.basemodulesService.getBaseModulesCount(args)
  }
  @Mutation((returns) => Permissions)
  async newPermissions(@CurrentUser({permId: [1005]}) _data: any) {
    return this.basemodulesService.create()
  }
  @Mutation((returns) => Permissions)
  async updatePermission(@Args('updatePermissionInput') updateBasemoduleInput: UpdatePermissionInput, @CurrentUser({permId: [1005]}) _data: any) {
    return this.basemodulesService.update(updateBasemoduleInput)
  }
  @Mutation((returns) => ReturnIsOkData)
  async updatePermissions(@Args('updatePermissionInput') updateBasemoduleInput: UpdatePermissionInput, @CurrentUser({permId: [1005]}) _data: any) {
    return this.basemodulesService.updateMulti(updateBasemoduleInput)
  }
}
