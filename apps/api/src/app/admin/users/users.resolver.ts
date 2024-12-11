import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { UsersService } from './users.service'
import { UpdateUserInput } from './dto/update-user.input'
import { Auth } from '../../auth/entities/auth.entity'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard'
import { FetchPaginationData, ReturnCauntData, ReturnIsOkData } from '../../_core/helpers/functions'
import { CurrentUser } from '../../auth/jwt/current-user.decorators'
import { UsersPagination } from './entities/user.entity'

@UseGuards(JwtAuthGuard)
@Resolver(() => Auth)
export class UsersResolver {
  constructor(private readonly basemodulesService: UsersService) {}

  @Query((returns) => UsersPagination)
  async usersPegination(@Args() args: FetchPaginationData, @CurrentUser({permId: [1008, 1009]}) _data: any) {
    return this.basemodulesService.getBaseModulesPagintaion(args)
  }
  @Query((returns) => ReturnCauntData)
  async usersCount(@Args() args: FetchPaginationData, @CurrentUser({permId: [1008, 1009]}) _data: any) {
    return this.basemodulesService.getBaseModulesCount(args)
  }

  @Mutation((returns) => Auth)
  async newUser(@CurrentUser({permId: [1009]}) _data: any) {
    return this.basemodulesService.create()
  }

  @Mutation((returns) => Auth)
  async updateUser(@Args('updateUserInput') updateBasemoduleInput: UpdateUserInput, @CurrentUser({permId: [1009]}) _data: any) {
    return this.basemodulesService.update(updateBasemoduleInput)
  }
  @Mutation((returns) => ReturnIsOkData)
  async updateUsers(@Args('updateUserInput') updateBasemoduleInput: UpdateUserInput, @CurrentUser({permId: [1009]}) _data: any) {
    return this.basemodulesService.updateMulti(updateBasemoduleInput)
  }
  
}
