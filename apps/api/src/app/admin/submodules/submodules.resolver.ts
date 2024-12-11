import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql'
import { SubmodulesService } from './submodules.service'
import { SubModules, SubModulesPagination } from './entities/submodule.entity'
import { CreateSubmoduleInput } from './dto/create-submodule.input'
import { UpdateSubmoduleInput } from './dto/update-submodule.input'
import { FetchPaginationData, ReturnCauntData, ReturnIsOkData } from '../../_core/helpers/functions'
import { CurrentUser } from '../../auth/jwt/current-user.decorators'
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard'
import { UseGuards } from '@nestjs/common'
import { PermissionsService } from '../permissions/permissions.service'

@UseGuards(JwtAuthGuard)
@Resolver(() => SubModules)
export class SubmodulesResolver {
  constructor(private readonly basemodulesService: SubmodulesService, private _servicePermissions: PermissionsService) {}

  @Query((returns) => [SubModules])
  async submodules(@Args('search') search: string) {
    return this.basemodulesService.getSubModules(search)
  }
  @Query((returns) => SubModulesPagination)
  async submodulesPegination(@Args() args: FetchPaginationData, @CurrentUser({permId: [1002, 1003]}) _data: any) {
    return this.basemodulesService.getBaseModulesPagintaion(args)
  }
  @Query((returns) => ReturnCauntData)
  async submodulesCount(@Args() args: FetchPaginationData, @CurrentUser({permId: [1002, 1003]}) _data: any) {
    return this.basemodulesService.getBaseModulesCount(args)
  }
  @Mutation((returns) => SubModules)
  async newSubModules(@CurrentUser({permId: [1003]}) _data: any) {
    return this.basemodulesService.create()
  }
  @Mutation((returns) => SubModules)
  async updateSubmodule(@Args('updateSubmoduleInput') updateBasemoduleInput: UpdateSubmoduleInput, @CurrentUser({permId: [1003]}) _data: any) {
    return this.basemodulesService.update(updateBasemoduleInput)
  }
  @Mutation((returns) => ReturnIsOkData)
  async updateSubmodules(@Args('updateSubmoduleInput') updateBasemoduleInput: UpdateSubmoduleInput, @CurrentUser({permId: [1003]}) _data: any) {
    return this.basemodulesService.updateMulti(updateBasemoduleInput)
  }

  @Query((returns) => [SubModules])
  subModulesByBaseId(@Args('id') id: string, @CurrentUser() _data: any) {
    return this.basemodulesService.findAllByBaseId(id)
  }

  @ResolveField()
  async permissions(@Parent() submodule: SubModules) {
    return this._servicePermissions.getPermissionBySubModuleId(submodule.id)
  }
}
