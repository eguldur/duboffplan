import { PartialType } from '@nestjs/mapped-types';
import { CreateFileserverDto } from './create-fileserver.dto';

export class UpdateFileserverDto extends PartialType(CreateFileserverDto) {}
