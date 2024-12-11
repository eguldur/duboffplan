import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { McompanyService } from './mcompany.service';
import { MCompany, MCompanyPagination } from './entities/mcompany.entity';
import { CreateMcompanyInput } from './dto/create-mcompany.input';
import { UpdateMcompanyInput } from './dto/update-mcompany.input';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Inject, UseGuards } from '@nestjs/common';
import { FetchPaginationData, ReturnCauntData } from '../_core/helpers/functions';
import { CurrentUser } from '../auth/jwt/current-user.decorators';
import { PubSubEngine } from 'graphql-subscriptions';

@UseGuards(JwtAuthGuard)
@Resolver(() => MCompany)
export class McompanyResolver {
  constructor(private readonly basemodulesService: McompanyService,
  @Inject('PUB_SUB') private   _pubSub: PubSubEngine
) {}

@Subscription(returns => MCompany, {
  filter: (payload, variables) =>
    payload.newMCompanySub.type === variables.type,
})
newMCompanySub(@Args('type') type: string, @CurrentUser() _data: any) {    
  return this._pubSub.asyncIterator('newMCompanySub');
}

@Query((returns) => [MCompany])
getMCompanyByBasecat(@Args('id') id: string, @CurrentUser() _data: any) {
  return this.basemodulesService.getActiveBaseModulesByBasecat(id)
}

@Query((returns) => [MCompany])
mCompanySelect(@Args('type') type: string, @CurrentUser() _data: any) {
  return this.basemodulesService.getActiveBaseModulesByType(type)
}

@Query((returns) => MCompanyPagination)
async mCompanyPegination(@Args() args: FetchPaginationData, @CurrentUser() _data: any) {
  return this.basemodulesService.getBaseModulesPagintaion(args)
}

@Query((returns) => ReturnCauntData)
async mCompanyCount(@Args() args: FetchPaginationData, @CurrentUser() _data: any) {
  return this.basemodulesService.getBaseModulesCount(args)
}

@Mutation((returns) => MCompany)
async newMCompany(@CurrentUser() _data: any) {
  return this.basemodulesService.create()
}

@Mutation((returns) => MCompany)
async updateMCompany(@Args('updateMCompanyInput') updateMcompanyInput: UpdateMcompanyInput, @CurrentUser() _data: any) {
  return this.basemodulesService.update(updateMcompanyInput)
}
}
