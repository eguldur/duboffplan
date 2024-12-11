import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Auth, AuthDocument } from '../auth/entities/auth.entity'
import { regexpSearch } from '../_core/helpers/functions'
import { CreateFileserverDto } from './dto/create-fileserver.dto'
import { CreateFolderDto } from './dto/create-folder.dto'
import { UpdateFileserverDto } from './dto/update-fileserver.dto'
import { FSfile, FSfileDocument, FSfolder, FSfolderDocument } from './entities/fileserver.entity'

@Injectable()
export class FileserverService {
  constructor(
    @InjectModel(Auth.name) private userModel: Model<AuthDocument>,
    @InjectModel(FSfolder.name) private folderModel: Model<FSfolderDocument>,
    @InjectModel(FSfile.name) private fileModel: Model<FSfileDocument>,
  ) {}

  async fileEditorBrowser(body: any, user: any) {
    let returnData = {}

    if (body.action == 'files') {
      const query = []
      let sorgu = {}
      let subfolderData: any = {}
      let sort: any = {}

      if (body.path && body.path != '/.') {
        subfolderData = await this.folderModel.findOne({ slug: body.path.replace('/', '') }).exec()
        query.push({ folderId: subfolderData._id })
      }

      if (body.mods && body.mods.onlyImages && body.mods.onlyImages === 'true') {
        query.push({ $or: regexpSearch(['mimefirst'], 'image') })
      }

      if (body.mods && body.mods.sortBy) {
        if (body.mods.sortBy === 'changed-asc') {
          sort = { updatedAt: 1 }
        } else if (body.mods.sortBy === 'changed-desc') {
          sort = { updatedAt: -1 }
        } else if (body.mods.sortBy === 'name-asc') {
          sort = { name: 1 }
        } else if (body.mods.sortBy === 'name-desc') {
          sort = { name: -1 }
        } else if (body.mods.sortBy === 'size-asc') {
          sort = { size: 1 }
        } else if (body.mods.sortBy === 'size-desc') {
          sort = { size: -1 }
        }
      }

      if (query.length > 0) {
        sorgu = { $and: query }
      }

      if (body.mods && body.mods.filterWord && body.mods.filterWord !== '') {
        query.push({ $or: regexpSearch(['name'], body.mods.filterWord) })
      }

      const files = await this.fileModel.find(sorgu).sort(sort).limit(50).exec()

      const filesData = []

      for (const file of files) {
        filesData.push({
          file: file.fileLink,
          name: file.name,
          type: file.mimefirst.split('/')[0],
          thumb: file.mimefirst.split('/')[0] === 'image' ? file.fileLink : 'file.png',
          changed: file.updatedAt.toLocaleString('tr-TR'),
          size: file.size > 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : (file.size / 1024).toFixed(2) + ' KB',
          isImage: file.mimefirst.split('/')[0] === 'image' ? true : false,
        })
      }

      returnData = {
        success: true,
        time: new Date().toLocaleString('tr-TR'),
        data: {
          sources: [
            {
              baseurl: process.env.WEB_API + '/',
              path: '',
              files: filesData,
              name: 'default',
            },
          ],
          code: 220,
        },
        elapsedTime: 0,
      }
    } else if (body.action == 'permissions') {
      returnData = {
        success: true,
        time: '2023-03-02 22:07:57',
        data: {
          permissions: {
            allowFiles: true,
            allowFileMove: false,
            allowFileUpload: true,
            allowFileUploadRemote: false,
            allowFileRemove: false,
            allowFileRename: false,
            allowFileDownload: true,
            allowFolders: true,
            allowFolderMove: false,
            allowFolderCreate: false,
            allowFolderRemove: false,
            allowFolderRename: false,
            allowFolderTree: false,
            allowImageResize: false,
            allowImageCrop: false,
            allowGeneratePdf: false,
          },
          code: 220,
        },
        elapsedTime: 0,
      }
    } else if (body.action == 'folders') {
      const folderData = ['.']

      let subfolderData: any = {}
      let sorgu = {}

      if (body.path) {
        subfolderData = await this.folderModel.findOne({ slug: body.path }).exec()
        sorgu = { folderId: subfolderData._id }
      } else {
        sorgu = { folderId: null }
      }

      const folders = await this.folderModel.find(sorgu).limit(50).exec()

      for (const folder of folders) {
        folderData.push(folder.slug)
      }

      returnData = {
        success: true,
        time: new Date().toLocaleString('tr-TR'),
        data: {
          sources: [
            {
              baseurl: process.env.WEB_API + '/',
              path: '',
              name: 'default',
              title: 'Images',
              folders: folderData,
            },
          ],
          code: 220,
        },
        elapsedTime: 0,
      }
    }
    return returnData
  }
  async createFile(createFileserverDto: CreateFileserverDto) {
    if (createFileserverDto.folderId) {
      const currentFolder = await this.folderModel.findById(createFileserverDto.folderId).exec()
      if (currentFolder) {
        currentFolder.size += createFileserverDto.size
        currentFolder.contents += 1
        await currentFolder.save()
      }
    }
    return this.fileModel.create(createFileserverDto)
  }

  async createFiles(createFileserverDto: CreateFileserverDto[], folderName: any) {
    if (folderName) {
      const currentFolder = await this.folderModel.findOne({ slug: folderName }).exec()
      for (const file of createFileserverDto) {
        if (currentFolder) {
          currentFolder.size += file.size
          currentFolder.contents += 1
        }
      }
      if (currentFolder) {
        createFileserverDto.map((file: any) => {
          file.folderId = currentFolder._id
          return file
        })
        await currentFolder.save()
      }
    }

    const uploadedFiles = await this.fileModel.create(createFileserverDto)
    const files: string[] = []
    const isImages: boolean[] = []
    const messages: string[] = []

    const returnData = {
      data: {
        baseurl: process.env.WEB_API + '/',
        code: 220,
        files: files,
        isImages: isImages,
        messages: messages,
      },
      eleapsedTime: 0,
      success: true,
      time: new Date().toLocaleString('tr-TR'),
    }

    for (const uploadedFile of createFileserverDto) {
      returnData.data.files.push(uploadedFile.fileLink)
      returnData.data.isImages.push(uploadedFile.mimefirst.split('/')[0] === 'image' ? true : false)
      returnData.data.messages.push(uploadedFile.name + ' yüklendi.')
    }

    return returnData
  }

  async createFolder(createFolderDto: CreateFolderDto, user: any) {
    createFolderDto.createdBy = user._id
    createFolderDto.type = 'folder'

    if (createFolderDto.folderId) {
      const currentFolder = await this.folderModel.findById(createFolderDto.folderId).exec()
      if (currentFolder) {
        currentFolder.contentsf += 1
        await currentFolder.save()
      }
    }

    return this.folderModel.create(createFolderDto)
  }

  async findAll(query: any) {
    const sorgu = []

    let searchQuary = {}
    let currentFolder = null
    const path = []
    if (query.folderId && query.folderId !== 'null' && query.folderId !== '') {
      currentFolder = await this.folderModel.findById(query.folderId).exec()
      if (currentFolder && currentFolder.folderId) {
        const parentFolder = await this.folderModel.findById(currentFolder.folderId).exec()
        path.push(parentFolder)
      }
      path.push(currentFolder)
      sorgu.push({ folderId: query.folderId })
    } else {
      sorgu.push({ folderId: null })
    }
    if (query.search && query.search !== 'null' && query.search !== '') {
      sorgu.push({ $or: regexpSearch(['name'], query.search) })
    }
    if (sorgu.length > 0) {
      searchQuary = { $and: sorgu }
    }

    const folders = await this.folderModel.find(searchQuary).populate('createdBy').exec()
    const files = await this.fileModel.find(searchQuary).populate('createdBy').exec()

    return { folders, files, path }
  }

  findOne(id: number) {
    return `This action returns a #${id} fileserver`
  }

  async getFolders() {
    const folders = await this.folderModel.find().sort({ folderId: 1, createdAt: 1 }).exec()

    return { folders }
  }

  update(id: number, updateFileserverDto: UpdateFileserverDto) {
    return `This action updates a #${id} fileserver`
  }

  updateFileName(id: string, updateData: any) {
    return this.fileModel.findByIdAndUpdate(id, { name: updateData.name }).exec()
  }

  async moveToFolder(id: string, updateData: any) {
    const moveObject = await this.fileModel.findById(id).exec()

    if (updateData.folderId === 'ana') {
      updateData.folderId = null
    }
    if (moveObject && moveObject.folderId) {
      const removeFolder = await this.folderModel.findById(moveObject.folderId).exec()
      if (removeFolder) {
        removeFolder.size -= moveObject.size
        removeFolder.contents -= 1
        await removeFolder.save()
      }
    }

    if (updateData.folderId) {
      const currentFolder = await this.folderModel.findById(updateData.folderId).exec()
      if (currentFolder && moveObject) {
        currentFolder.size += moveObject.size
        currentFolder.contents += 1
        await currentFolder.save()
      }
    }

    return this.fileModel.findByIdAndUpdate(id, { folderId: updateData.folderId }).exec()
  }

  async moveToFolderMulti(deleteIds: string[], updateData: any) {
    const moveObject = await this.fileModel.findById(deleteIds[0]).exec()
    const moveObjects = await this.fileModel.find({ _id: { $in: deleteIds } }).exec()

    if (updateData.folderId === 'ana') {
      updateData.folderId = null
    }
    if (moveObject?.folderId) {
      const removeFolder = await this.folderModel.findById(moveObject.folderId).exec()

      for (const deleteObject of moveObjects) {
        if (removeFolder) {
          removeFolder.size -= deleteObject.size
          removeFolder.contents -= 1
        }
      }
      if (removeFolder) {
        await removeFolder.save()
      }
    }

    if (updateData.folderId) {
      const currentFolder = await this.folderModel.findById(updateData.folderId).exec()

      for (const deleteObject of moveObjects) {
        if (currentFolder) {
          currentFolder.size += deleteObject.size
          currentFolder.contents += 1
        }
      }
      if (currentFolder) {
        await currentFolder.save()
      }
    }

    return this.fileModel.updateMany({ _id: { $in: deleteIds } }, { folderId: updateData.folderId }).exec()
  }

  updateFolderName(id: string, updateData: any) {
    return this.folderModel.findByIdAndUpdate(id, { name: updateData.name }).exec()
  }

  async remove(id: string) {
    const deleteObject = await this.fileModel.findById(id).exec()

    if (deleteObject && deleteObject.folderId) {
      const currentFolder = await this.folderModel.findById(deleteObject.folderId).exec()
      if (currentFolder) {
        currentFolder.size -= deleteObject.size
        currentFolder.contents -= 1
        await currentFolder.save()
      }
    }
    const deleteObjectLast = await this.fileModel.deleteOne({ _id: id }).exec()

    return deleteObjectLast
  }

  async removeMulti(deleteIds: string[]) {
    const deleteObject = await this.fileModel.findById(deleteIds[0]).exec()

    if (deleteObject && deleteObject.folderId) {
      const currentFolder = await this.folderModel.findById(deleteObject.folderId).exec()

      const deleteObjects = await this.fileModel.find({ _id: { $in: deleteIds } }).exec()

      for (const deleteObject of deleteObjects) {
        if (currentFolder) {
          currentFolder.size -= deleteObject.size
          currentFolder.contents -= 1
        }
      }
      if (currentFolder) {
        await currentFolder.save()
      }
    }
    const deleteObjectLast = await this.fileModel.deleteMany({ _id: { $in: deleteIds } }).exec()

    return deleteObjectLast
  }
}
