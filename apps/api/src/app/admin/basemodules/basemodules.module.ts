import { Module } from '@nestjs/common';
import { BasemodulesService } from './basemodules.service';
import { BasemodulesResolver } from './basemodules.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseModules, BaseModulesSchema } from './entities/basemodule.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BaseModules.name, schema: BaseModulesSchema },
    ]),
  ],
  providers: [BasemodulesResolver, BasemodulesService],
})
export class BasemodulesModule {}
