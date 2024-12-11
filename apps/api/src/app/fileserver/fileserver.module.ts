import { Module } from '@nestjs/common';
import { FileserverService } from './fileserver.service';
import { FileserverController } from './fileserver.controller';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FSfile, FSfileSchema, FSfolder, FSfolderSchema } from './entities/fileserver.entity';
import { Auth, AuthSchema } from '../auth/entities/auth.entity';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: FSfolder.name, schema: FSfolderSchema },
      { name: FSfile.name, schema: FSfileSchema },
      { name: Auth.name, schema: AuthSchema },
    ]),
  ],
  controllers: [FileserverController],
  providers: [FileserverService],
})
export class FileserverModule {}
