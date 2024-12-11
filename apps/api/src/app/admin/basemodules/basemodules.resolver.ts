import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { BasemodulesService } from './basemodules.service'
import { BaseModules, BaseModulesPagination } from './entities/basemodule.entity'
import { CreateBasemoduleInput } from './dto/create-basemodule.input'
import { UpdateBasemoduleInput } from './dto/update-basemodule.input'
import { FetchPaginationData, ReturnCauntData, ReturnIsOkData } from '../../_core/helpers/functions'
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard'
import { UseGuards } from '@nestjs/common'
import { CurrentUser } from '../../auth/jwt/current-user.decorators'

@UseGuards(JwtAuthGuard)
@Resolver(() => BaseModules)
export class BasemodulesResolver {



  constructor(private readonly basemodulesService: BasemodulesService) {

  }

  @Query((returns) => BaseModulesPagination)
  async basemodulesPegination(@Args() args: FetchPaginationData, @CurrentUser({permId: [1000, 1001]}) _data: any) {
    return this.basemodulesService.getBaseModulesPagintaion(args)
  }

  @Query((returns) => ReturnCauntData)
  async basemodulesCount(@Args() args: FetchPaginationData, @CurrentUser({permId: [1000, 1001]}) _data: any) {
    return this.basemodulesService.getBaseModulesCount(args)
  }

  @Mutation((returns) => BaseModules)
  async newBaseModules(@CurrentUser({permId: [1001]}) _data: any) {
    return this.basemodulesService.create()
  }

  @Mutation((returns) => BaseModules)
  async updateBasemodule(@Args('updateBasemoduleInput') updateBasemoduleInput: UpdateBasemoduleInput, @CurrentUser({permId: [1001]}) _data: any) {
    return this.basemodulesService.update(updateBasemoduleInput)
  }

  @Mutation((returns) => ReturnIsOkData)
  async updateBasemodules(@Args('updateBasemoduleInput') updateBasemoduleInput: UpdateBasemoduleInput, @CurrentUser({permId: [1001]}) _data: any) {
    return this.basemodulesService.updateMulti(updateBasemoduleInput)
  }

  @Query((returns) => [BaseModules])
  async baseModulesActive(@CurrentUser() _data: any) {
    return this.basemodulesService.findAllActive()
  }
}
