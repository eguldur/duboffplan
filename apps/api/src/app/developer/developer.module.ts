import { Module } from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { DeveloperResolver } from './developer.resolver';

@Module({
  providers: [DeveloperResolver, DeveloperService],
})
export class DeveloperModule {}
