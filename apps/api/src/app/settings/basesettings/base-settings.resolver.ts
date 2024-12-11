import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { BaseSettingsService } from './base-settings.service';
import { BaseSettings, BaseSettingsPagination } from './entities/base-setting.entity';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { Inject, UseGuards } from '@nestjs/common';
import { FetchPaginationData, ReturnCauntData } from '../../_core/helpers/functions';
import { CurrentUser } from '../../auth/jwt/current-user.decorators';
import { UpdateBasesettingInput } from './dto/update-base-setting.input';
import { PubSubEngine } from 'graphql-subscriptions';

@UseGuards(JwtAuthGuard)
@Resolver(() => BaseSettings)
export class BaseSettingsResolver {
  constructor(private readonly basemodulesService: BaseSettingsService, @Inject('PUB_SUB') private _pubSub: PubSubEngine) {}


  @Subscription(returns => BaseSettings, {
    filter: (payload, variables) =>
      payload.newSettingSub.type === variables.type,
  })
  newSettingSub(@Args('type') type: string, @CurrentUser() _data: any) {    
    return this._pubSub.asyncIterator('newSettingSub');
  }

  @Query((returns) => [BaseSettings])
  getBaseSettingsByBasecat(@Args('id') id: string, @CurrentUser() _data: any) {
    return this.basemodulesService.getActiveBaseModulesByBasecat(id)
  }

  @Query((returns) => [BaseSettings])
  baseSettingsSelect(@Args('type') type: string, @CurrentUser() _data: any) {
    return this.basemodulesService.getActiveBaseModulesByType(type)
  }

  @Query((returns) => BaseSettingsPagination)
  async basesettingsPegination(@Args() args: FetchPaginationData, @CurrentUser() _data: any) {
    return this.basemodulesService.getBaseModulesPagintaion(args)
  }

  @Query((returns) => ReturnCauntData)
  async basesettingsCount(@Args() args: FetchPaginationData, @CurrentUser() _data: any) {
    return this.basemodulesService.getBaseModulesCount(args)
  }

  @Mutation((returns) => BaseSettings)
  async newBaseSettings(@CurrentUser() _data: any) {
    return this.basemodulesService.create()
  }

  @Mutation((returns) => BaseSettings)
  async updateBaseSetting(@Args('updateBasesettingInput') updateBasemoduleInput: UpdateBasesettingInput, @CurrentUser() _data: any) {
    return this.basemodulesService.update(updateBasemoduleInput)
  }
}
