import { Inject, Injectable } from '@nestjs/common';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument, ProjectPagination } from './entities/project.entity';
import { UploadFromBase64Service } from '../_core/services/upload-from-base-64.service';
import { PubSubEngine } from 'graphql-subscriptions';
import { FetchPaginationData, regexpSearch, ReturnCauntData } from '../_core/helpers/functions';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private baseModulModel: Model<ProjectDocument>,
    private imageBase64Service: UploadFromBase64Service,
    @Inject('PUB_SUB') private _pubSub: PubSubEngine,
  ) {}
  async getBaseModuleById(id: any): Promise<ProjectDocument> {
    return await this.baseModulModel.findById(id).populate('developer mcompany').exec();
  }

  async getActiveBaseModulesByType(type: string): Promise<ProjectDocument[]> {
    return await this.baseModulModel.find({ isActive: true, type: type }).sort({ title: 1, updatedAt: -1 }).collation({ locale: 'tr' }).exec();
  }

  async getActiveBaseModulesByBasecat(basekat: string): Promise<ProjectDocument[]> {
    return await this.baseModulModel.find({ isActive: true, basekat: basekat }).sort({ title: 1, updatedAt: -1 }).collation({ locale: 'tr' }).exec();
  }

  async getBaseModulesCountActive(): Promise<number> {
    return await this.baseModulModel.countDocuments({ isActive: true });
  }

  async getBaseModulesPagintaion(args: FetchPaginationData): Promise<ProjectPagination> {
    const { search, sort, order, page, size, status, filter, type, selectedIds } = args;
    let query = {};
    if (search) {
      query = { $or: regexpSearch(['title'], search) };
    }

    if (type) {
      query = { ...query, type: type };
    }

    if (selectedIds && selectedIds.length > 0) {
      query = { ...query, _id: { $in: selectedIds } };
    }

    if (filter && filter != '') {
      const filterObj = JSON.parse(filter);
      if (filterObj.status) {
        query = { ...query, isActive: filterObj.status == '1' ? true : false };
      }
    }

    if (status && status != '0') {
      query = { ...query, isActive: status == '1' ? true : false };
    }

    const ordertpye = order == 'asc' ? 1 : -1;
    const totalData = await this.baseModulModel.find(query).countDocuments();
    const returnData = await this.baseModulModel
      .find(query)
      .skip(page * size)
      .populate('developer mcompany')
      .limit(size)
      .sort({ [sort]: ordertpye })
      .collation({ locale: 'tr' })
      .exec();
    const pagination = {
      length: totalData,
      size: size,
      page: page,
      lastPage: Math.ceil(totalData / size),
      startIndex: size * page,
      endIndex: size * page + returnData.length - 1,
    };
    return { pagination, items: returnData };
  }

  async getBaseModulesCount(args: FetchPaginationData): Promise<ReturnCauntData> {
    const { filter, type } = args;
    let query = {};
    let query1 = {};
    let query2 = {};
    if (filter && filter != '') {
      const filterObj = JSON.parse(filter);
      if (filterObj.status) {
        query = { ...query, isActive: filterObj.status == '1' ? true : false };
      }
    }

    if (type) {
      query = { ...query, type: type };
    }

    query1 = { ...query, isActive: true };
    query2 = { ...query, isActive: false };
    const [count1, count2] = await Promise.all([
      this.baseModulModel.find(query1).countDocuments(),
      this.baseModulModel.find(query2).countDocuments(),
    ]);
    return { count1, count2 };
  }

  async create(): Promise<ProjectDocument> {
    return await new this.baseModulModel();
  }

  async update(updateBasemoduleInput: UpdateProjectInput, changeAvatar: boolean): Promise<ProjectDocument> {
    const { id, type } = updateBasemoduleInput;
    if (changeAvatar) {
      updateBasemoduleInput.logo = await this.imageBase64Service.uploadBase64Sharp(updateBasemoduleInput.logo);
    }
    const returnData = await this.baseModulModel.findByIdAndUpdate(id, updateBasemoduleInput, {
      new: true,
      upsert: true,
    }).populate('developer mcompany');

    await this._pubSub.publish('newProjectSub', { newProjectSub: returnData });
    return returnData;
  }
}
