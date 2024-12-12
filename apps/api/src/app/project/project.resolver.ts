import { Resolver, Query, Mutation, Args, Int, Subscription, ResolveField, Parent } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { Project, ProjectPagination, ProjectUnitsDLD } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { FetchPaginationData, ReturnCauntData } from '../_core/helpers/functions';
import { CurrentUser } from '../auth/jwt/current-user.decorators';
import { PubSubEngine } from 'graphql-subscriptions';
import { BaseSettings } from '../settings/basesettings/entities/base-setting.entity';
import { BaseSettingsService } from '../settings/basesettings/base-settings.service';
import { Inject, UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Resolver(() => Project)
export class ProjectResolver {
  constructor(
    private readonly basemodulesService: ProjectService,
    @Inject('PUB_SUB') private _pubSub: PubSubEngine,
  ) {}

  @Subscription((returns) => Project, {
    filter: (payload, variables) => payload.newProjectSub.type === variables.type,
  })
  newProjectSub(@Args('type') type: string, @CurrentUser() _data: any) {
    return this._pubSub.asyncIterator('newProjectSub');
  }

  @Query((returns) => [Project])
  getProjectByBasecat(@Args('id') id: string, @CurrentUser() _data: any) {
    return this.basemodulesService.getActiveBaseModulesByBasecat(id);
  }

  @Query((returns) => [Project])
  projectSelect(@Args('type') type: string, @CurrentUser() _data: any) {
    return this.basemodulesService.getActiveBaseModulesByType(type);
  }

  @Query((returns) => ProjectPagination)
  async projectPegination(@Args() args: FetchPaginationData, @CurrentUser() _data: any) {
    return this.basemodulesService.getBaseModulesPagintaion(args);
  }

  @Query((returns) => ReturnCauntData)
  async developerCount(@Args() args: FetchPaginationData, @CurrentUser() _data: any) {
    return this.basemodulesService.getBaseModulesCount(args);
  }

  @Mutation((returns) => Project)
  async newProject(@CurrentUser() _data: any) {
    return this.basemodulesService.create();
  }

  @Mutation((returns) => Project)
  async updateProject(
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput,
    @Args('changeAvatar') changeAvatar: boolean,
    @CurrentUser() _data: any,
  ) {
    return this.basemodulesService.update(updateProjectInput, changeAvatar);
  }
}
@Resolver(() => ProjectUnitsDLD)
export class ProjectUnitsDLDResolver {
  constructor(private readonly baseSettingsService: BaseSettingsService) {}

  @ResolveField(() => BaseSettings)
  async propertytype(@Parent() parent: ProjectUnitsDLD) {
    if (parent.propertytype) {
      return this.baseSettingsService.getBaseModuleById(parent.propertytype);
    }
    return null;
  }

  @ResolveField(() => BaseSettings)
  async usagetype(@Parent() parent: ProjectUnitsDLD) {
    if (parent.usagetype) {
      return this.baseSettingsService.getBaseModuleById(parent.usagetype);
    }
    return null;
  }
}
