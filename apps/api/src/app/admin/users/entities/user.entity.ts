import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Auth } from '../../../auth/entities/auth.entity';
import { ReturnPaginationData } from '../../../_core/helpers/functions';

@ObjectType('UsersPagination')
export class UsersPagination {

  @Field({ nullable: true })
  pagination: ReturnPaginationData

  @Field(type => [Auth], { nullable: true })
  items: Auth[]


}