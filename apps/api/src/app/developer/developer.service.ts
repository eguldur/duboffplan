import { Inject, Injectable } from '@nestjs/common';
import { CreateDeveloperInput } from './dto/create-developer.input';
import { UpdateDeveloperInput } from './dto/update-developer.input';
import { InjectModel } from '@nestjs/mongoose';
import { Developer, DeveloperDocument, DeveloperPagination } from './entities/developer.entity';
import { Model } from 'mongoose';
import { PubSubEngine } from 'graphql-subscriptions';
import { FetchPaginationData, regexpSearch, ReturnCauntData } from '../_core/helpers/functions';
import { UploadFromBase64Service } from '../_core/services/upload-from-base-64.service';

@Injectable()
export class DeveloperService {
  constructor(
    @InjectModel(Developer.name) private baseModulModel: Model<DeveloperDocument>,
    private imageBase64Service: UploadFromBase64Service,

    @Inject('PUB_SUB') private _pubSub: PubSubEngine,
  ) {}
  async getBaseModuleById(id: any): Promise<DeveloperDocument> {
    return await this.baseModulModel.findById(id).exec();
  }

  async getActiveBaseModulesByType(type: string): Promise<DeveloperDocument[]> {
    return await this.baseModulModel.find({ isActive: true, type: type }).sort({ title: 1, updatedAt: -1 }).collation({ locale: 'tr' }).exec();
  }

  async getActiveBaseModulesByBasecat(basekat: string): Promise<DeveloperDocument[]> {
    return await this.baseModulModel.find({ isActive: true, basekat: basekat }).sort({ title: 1, updatedAt: -1 }).collation({ locale: 'tr' }).exec();
  }

  async getBaseModulesPagintaion(args: FetchPaginationData): Promise<DeveloperPagination> {
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

  async create(): Promise<DeveloperDocument> {
    return await new this.baseModulModel();
  }

  async update(updateBasemoduleInput: UpdateDeveloperInput, changeAvatar: boolean): Promise<DeveloperDocument> {
    const { id, type } = updateBasemoduleInput;
    if (changeAvatar) {
      updateBasemoduleInput.logo = await this.imageBase64Service.uploadBase64Sharp(updateBasemoduleInput.logo);
    }
    const returnData = await this.baseModulModel.findByIdAndUpdate(id, updateBasemoduleInput, {
      new: true,
      upsert: true,
    });

    await this._pubSub.publish('newDeveloperSub', { newDeveloperSub: returnData });
    return returnData;
  }
}
