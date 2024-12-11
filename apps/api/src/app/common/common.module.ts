import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonResolver } from './common.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BaseModules,
  BaseModulesSchema,
} from '../admin/basemodules/entities/basemodule.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BaseModules.name, schema: BaseModulesSchema },
    ]),
  ],
  providers: [
    CommonResolver,
    CommonService,
  ]
})
export class CommonModule {}
