import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DeveloperService } from './developer.service';
import { Developer } from './entities/developer.entity';
import { CreateDeveloperInput } from './dto/create-developer.input';
import { UpdateDeveloperInput } from './dto/update-developer.input';

@Resolver(() => Developer)
export class DeveloperResolver {
  constructor(private readonly developerService: DeveloperService) {}

  @Mutation(() => Developer)
  createDeveloper(
    @Args('createDeveloperInput') createDeveloperInput: CreateDeveloperInput,
  ) {
    return this.developerService.create(createDeveloperInput);
  }

  @Query(() => [Developer], { name: 'developer' })
  findAll() {
    return this.developerService.findAll();
  }

  @Query(() => Developer, { name: 'developer' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.developerService.findOne(id);
  }

  @Mutation(() => Developer)
  updateDeveloper(
    @Args('updateDeveloperInput') updateDeveloperInput: UpdateDeveloperInput,
  ) {
    return this.developerService.update(
      updateDeveloperInput.id,
      updateDeveloperInput,
    );
  }

  @Mutation(() => Developer)
  removeDeveloper(@Args('id', { type: () => Int }) id: number) {
    return this.developerService.remove(id);
  }
}
