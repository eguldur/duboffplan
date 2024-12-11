import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

export class CreateFileserverDto {
  @IsString()
  name: string;

  createdBy: string;

  folderId: string | null;

  type: string;

  size: number;

  mimefirst: string;

  mimesecond: string;

  fileLink: string;

  isPrivate?: boolean;
}
