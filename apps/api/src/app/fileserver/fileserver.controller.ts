import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileserverService } from './fileserver.service';
import { CreateFileserverDto } from './dto/create-fileserver.dto';
import { UpdateFileserverDto } from './dto/update-fileserver.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateFolderDto } from './dto/create-folder.dto';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as iconv from 'iconv-lite';
import slugify from 'slugify';
import { GetUser } from '../auth/jwt/get-user.decorator';

@UseGuards(AuthGuard())
@Controller('fileserver')
export class FileserverController {
  constructor(private readonly fileserverService: FileserverService) {}

  @Post('createFolder')
  async createFolder(@Body() createFolderDto: CreateFolderDto, @GetUser() user: any) {
    return this.fileserverService.createFolder(createFolderDto, user);
  }

  @Post('fileEditorBrowser')
  async fileEditorBrowser(@Body() body: any, @GetUser() user: any) {
    return this.fileserverService.fileEditorBrowser(body, user);
  }

  @Post('uploadFile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, 'img', 'uploads'),
        filename: (req: any, file: any, cb: any) => {
          const editedfilename = iconv.decode(iconv.encode(file.originalname, 'ISO-8859-9'), 'UTF-8');
          const randomText = Array(8)
            .fill(null)
            .map(() => Math.round(Math.random() * 8).toString(8))
            .join('');
          const randomName = slugify(editedfilename.replace(extname(editedfilename), ''), { locale: 'tr' }) + randomText;
          cb(null, `${randomName}${extname(editedfilename)}`);
        },
      }),
      limits: { fileSize: 150 * 1024 * 1024 },
    }),
  )
  uploadSingle(@UploadedFile() file: any, @GetUser() user: any, @Body() body: any) {
    const newFile: CreateFileserverDto = {
      name: body.filename,
      createdBy: user._id,
      folderId: body.folderId && body.folderId !== 'null' ? body.folderId : null,
      type: extname(body.filename).replace('.', '').toUpperCase(),
      size: file.size,
      mimefirst: file.mimetype,
      mimesecond: file.mimetype,
      fileLink: file.filename,
    };

    return this.fileserverService.createFile(newFile);
  }

  @Post('uploadFileNoSave')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, 'img', 'uploads'),
        filename: (req: any, file: any, cb: any) => {
          const editedfilename = iconv.decode(iconv.encode(file.originalname, 'ISO-8859-9'), 'UTF-8');
          const randomText = Array(8)
            .fill(null)
            .map(() => Math.round(Math.random() * 8).toString(8))
            .join('');
          const randomName = slugify(editedfilename.replace(extname(editedfilename), ''), { locale: 'tr' }) + randomText;
          cb(null, `${randomName}${extname(editedfilename)}`);
        },
      }),
      limits: { fileSize: 150 * 1024 * 1024 },
    }),
  )
  uploadFileNoSave(@UploadedFile() file: any, @GetUser() user: any, @Body() body: any) {
    const newFile: CreateFileserverDto = {
      name: body.filename,
      createdBy: user._id,
      folderId: body.folderId && body.folderId !== 'null' ? body.folderId : null,
      type: extname(body.filename).replace('.', '').toUpperCase(),
      size: file.size,
      mimefirst: file.mimetype,
      mimesecond: file.mimetype,
      fileLink: file.filename,
      isPrivate: file.isPrivate || false,
    };

    return newFile;
  }

  @Post('uploadFilesEditor')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: join(__dirname, 'img', 'uploads'),
        filename: (req: any, file: any, cb: any) => {
          const editedfilename = iconv.decode(iconv.encode(file.originalname, 'ISO-8859-9'), 'UTF-8');
          const randomText = Array(8)
            .fill(null)
            .map(() => Math.round(Math.random() * 8).toString(8))
            .join('');
          const randomName = slugify(editedfilename.replace(extname(editedfilename), ''), { locale: 'tr' }) + randomText;
          cb(null, `${randomName}${extname(editedfilename)}`);
        },
      }),
      limits: { fileSize: 150 * 1024 * 1024 },
    }),
  )
  uploadFile(@UploadedFiles() files: any, @GetUser() user: any, @Body() body: any) {
    let foldername: string | null = null;

    if (body.path && body.path != '/.') {
      foldername = body.path.replace('/', '');
    }

    files.map((file: any) => {
      file.originalname = iconv.decode(iconv.encode(file.originalname, 'ISO-8859-9'), 'UTF-8');
    });
    const newFile: CreateFileserverDto[] = [];
    for (const file of files) {
      newFile.push({
        name: file.originalname,
        createdBy: user._id,
        folderId: null,
        type: extname(file.originalname).replace('.', '').toUpperCase(),
        size: file.size,
        mimefirst: file.mimetype,
        mimesecond: file.mimetype,
        fileLink: file.filename,
      });
    }
    return this.fileserverService.createFiles(newFile, foldername);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.fileserverService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileserverService.findOne(+id);
  }

  @Get('folders/all')
  getFolders() {
    return this.fileserverService.getFolders();
  }

  @Patch('editFilename/:id')
  async editFilename(@Param('id') id: string, @Body() folderData: any) {
    return this.fileserverService.updateFileName(id, folderData);
  }

  @Patch('editFoldername/:id')
  async editFoldername(@Param('id') id: string, @Body() folderData: any) {
    return this.fileserverService.updateFolderName(id, folderData);
  }

  @Patch('moveToFolder/:id')
  async moveToFolder(@Param('id') id: string, @Body() folderData: any) {
    return this.fileserverService.moveToFolder(id, folderData);
  }

  @Post('moveToFolderMulti')
  async moveToFolderMulti(@Body('fileids') fileids: string[], @Body('folderdata') folderdata: any) {
    return this.fileserverService.moveToFolderMulti(fileids, folderdata);
  }

  @Post('deleteFiles')
  async removeMulti(@Body('fileids') fileids: string[]) {
    return this.fileserverService.removeMulti(fileids);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.fileserverService.remove(id);
  }
}
