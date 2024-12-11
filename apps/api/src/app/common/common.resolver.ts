import { Resolver, Query, Mutation, Args, Int, Subscription, } from '@nestjs/graphql';
import { CommonService } from './common.service';
import { NavigationBase } from './entities/common.entity';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import {  UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/jwt/current-user.decorators';



@Resolver(() => NavigationBase)
export class CommonResolver {
  constructor( private readonly commonService: CommonService, ) {}

  @UseGuards(JwtAuthGuard)
  @Query((returns) => [NavigationBase])
  async navigation(@CurrentUser() _data: any) {
    return this.commonService.getnavigation(_data)
  }

  
}
