import { IsString } from "class-validator";
import { type } from "os";

export class CreateFolderDto {
    @IsString()
    name: string;

    createdBy: string;

    folderId: string;

    type: string;
}
