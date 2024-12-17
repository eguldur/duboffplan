import { Resolver, Query, Mutation, Args, Int, Subscription, ResolveField, Parent } from '@nestjs/graphql';
import { CitizenService } from './citizens.service';
import { Citizen, CitizenPagination} from './entities/citizen.entity';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Inject, UseGuards } from '@nestjs/common';
import { FetchPaginationData, ReturnCauntData } from '../_core/helpers/functions';
import { CurrentUser } from '../auth/jwt/current-user.decorators';
import { UpdateCitizenInput } from './dto/update-citizen.input';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseSettingsService } from '../settings/basesettings/base-settings.service';
import { BaseSettings } from '../settings/basesettings/entities/base-setting.entity';

@UseGuards(JwtAuthGuard)
@Resolver(() => Citizen)
export class CitizenResolver {
  constructor(
    private readonly citizenService: CitizenService,
    @Inject('PUB_SUB') private _pubSub: PubSubEngine,
  ) {}

  @Subscription(() => Citizen, {
    filter: (payload, variables) => payload.citizenSub.type === variables.type,
  })
  citizenSub(@Args('type') type: string, @CurrentUser() _data: any) {
    return this._pubSub.asyncIterator('citizenSub');
  }

  @Query(() => Number)
  async citizenCountActive(@CurrentUser() _data: any) {
    return this.citizenService.getBaseModulesCountActive();
  }

  @Query(() => [Citizen])
  async developerContacts(@Args('developerId') developerId: string, @CurrentUser() _data: any) {
    return this.citizenService.getCitizenByDeveloper(developerId);
  }

  @Query(() => CitizenPagination)
  async citizensPegination(@Args() args: FetchPaginationData, @CurrentUser() _data: any) {
    return this.citizenService.getBaseModulesPagintaion(args);
  }

  @Query(() => ReturnCauntData)
  async citizensCount(@Args() args: FetchPaginationData, @CurrentUser() _data: any) {
    return this.citizenService.getBaseModulesCount(args);
  }

  @Mutation(() => Citizen)
  async newCitizen(@CurrentUser() _data: any) {
    return this.citizenService.create();
  }

  @Mutation(() => Citizen)
  async updateCitizen(@Args('updateCitizenInput') updateCitizenInput: UpdateCitizenInput, @Args('changeAvatar') changeAvatar: boolean, @CurrentUser() _data: any) {
    return this.citizenService.update(updateCitizenInput, _data, changeAvatar);
  }

  @Query(() => Citizen)
  async getCitizenById(@Args('id') id: string, @CurrentUser() _data: any) {
    return this.citizenService.getCitizenById(id);
  }

  @Query(() => [Citizen])
  async searchCitizen(@Args('searchtext') search: string, @CurrentUser() _data: any) {
    return this.citizenService.searchCitizen(search);
  }
}


