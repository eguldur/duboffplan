import { Resolver, Query, Mutation, Args, Int, Subscription, Parent, ResolveField } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { Developer, DeveloperPagination, Phone, SocialMediaAccount } from './entities/developer.entity';
import { CreateDeveloperInput } from './dto/create-developer.input';
import { UpdateDeveloperInput } from './dto/update-developer.input';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { FetchPaginationData, ReturnCauntData } from '../_core/helpers/functions';
import { CurrentUser } from '../auth/jwt/current-user.decorators';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseSettings } from '../settings/basesettings/entities/base-setting.entity';
import { BaseSettingsService } from '../settings/basesettings/base-settings.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => Developer)
export class DeveloperResolver {
  constructor(
    private readonly basemodulesService: DeveloperService,
    @Inject('PUB_SUB') private _pubSub: PubSubEngine,
  ) {}
  @Subscription((returns) => Developer, {
    filter: (payload, variables) => payload.newDeveloperSub.type === variables.type,
  })
  newDeveloperSub(@Args('type') type: string, @CurrentUser() _data: any) {
    return this._pubSub.asyncIterator('newDeveloperSub');
  }

  @Query((returns) => Number)
  async developerCountActive(@CurrentUser() _data: any) {
    return this.basemodulesService.getBaseModulesCountActive();
  }
  
  @Query((returns) => Developer)
  developer(@Args('id') id: string, @CurrentUser() _data: any) {
    return this.basemodulesService.getBaseModuleById(id);
  }


  @Query((returns) => [Developer])
  getDeveloperByBasecat(@Args('id') id: string, @CurrentUser() _data: any) {
    return this.basemodulesService.getActiveBaseModulesByBasecat(id);
  }

  @Query((returns) => [Developer])
  developerSelect(@Args('type') type: string, @CurrentUser() _data: any) {
    return this.basemodulesService.getActiveBaseModulesByType(type);
  }

  @Query((returns) => DeveloperPagination)
  async developerPegination(@Args() args: FetchPaginationData, @CurrentUser() _data: any) {
    return this.basemodulesService.getBaseModulesPagintaion(args);
  }

  @Query((returns) => ReturnCauntData)
  async developerCount(@Args() args: FetchPaginationData, @CurrentUser() _data: any) {
    return this.basemodulesService.getBaseModulesCount(args);
  }

  @Mutation((returns) => Developer)
  async newDeveloper(@CurrentUser() _data: any) {
    return this.basemodulesService.create();
  }

  @Mutation((returns) => Developer)
  async updateDeveloper(
    @Args('updateDeveloperInput') updateDeveloperInput: UpdateDeveloperInput,
    @Args('changeAvatar') changeAvatar: boolean,
    @CurrentUser() _data: any,
  ) {
    return this.basemodulesService.update(updateDeveloperInput, changeAvatar);
  }
}
@Resolver(() => Phone)
export class PhoneResolver {
  constructor(private readonly baseSettingsService: BaseSettingsService) {}

  @ResolveField(() => BaseSettings)
  async phoneType(@Parent() parent: Phone) {
    if (parent.phoneType) {
      return this.baseSettingsService.getBaseModuleById(parent.phoneType);
    }
    return null;
  }
}

@Resolver(() => SocialMediaAccount)
export class SocialMediaAccountResolver {
  constructor(private readonly baseSettingsService: BaseSettingsService) {}

  @ResolveField(() => BaseSettings)
  async platform(@Parent() parent: SocialMediaAccount) {
    if (parent.platform) {
      return this.baseSettingsService.getBaseModuleById(parent.platform);
    }
    return null;
  }
}
