import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Developer {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
