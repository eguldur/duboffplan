import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { RolesService } from './roles.service'
import { Roles, RolesPagination } from './entities/role.entity'
import { CreateRoleInput } from './dto/create-role.input'
import { UpdateRoleInput } from './dto/update-role.input'
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard'
import { UseGuards } from '@nestjs/common'
import { CurrentUser } from '../../auth/jwt/current-user.decorators'
import { FetchPaginationData, ReturnCauntData, ReturnIsOkData } from '../../_core/helpers/functions'

@UseGuards(JwtAuthGuard)
@Resolver(() => Roles)
export class RolesResolver {
  constructor(private readonly basemodulesService: RolesService) {}

  @Query((returns) => Roles)
  async role(@Args('id') id: string) {
    return this.basemodulesService.getRoleById(id)
  }
  @Query((returns) => [Roles])
  async rolesActive() {
    return this.basemodulesService.rolesActive()
  }

  

  @Query((returns) => RolesPagination)
  async rolesPegination(@Args() args: FetchPaginationData, @CurrentUser({permId: [1006, 1007]}) _data: any) {
    return this.basemodulesService.getBaseModulesPagintaion(args)
  }
  @Query((returns) => ReturnCauntData)
  async rolesCount(@Args() args: FetchPaginationData, @CurrentUser({permId: [1006, 1007]}) _data: any) {
    return this.basemodulesService.getBaseModulesCount(args)
  }
  @Mutation((returns) => Roles)
  async newRoles(@CurrentUser({permId: [1007]}) _data: any) {
    return this.basemodulesService.create()
  }

  @Mutation((returns) => Roles)
  async updateRole(@Args('updateRoleInput') updateBasemoduleInput: UpdateRoleInput, @CurrentUser({permId: [1007]}) _data: any) {
    return this.basemodulesService.update(updateBasemoduleInput)
  }

  @Mutation((returns) => ReturnIsOkData)
  async updateRoles(@Args('updateRoleInput') updateBasemoduleInput: UpdateRoleInput, @CurrentUser({permId: [1007]}) _data: any) {
    return this.basemodulesService.updateMulti(updateBasemoduleInput)
  }
}
