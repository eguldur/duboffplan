import { Inject, Injectable } from '@nestjs/common';
import { BaseSettings, BaseSettingsDocument, BaseSettingsPagination } from './entities/base-setting.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FetchPaginationData, regexpSearch, ReturnCauntData } from '../../_core/helpers/functions';
import { UpdateBasesettingInput } from './dto/update-base-setting.input';
import { PubSubEngine } from 'graphql-subscriptions';

@Injectable()
export class BaseSettingsService {
  constructor(
    @InjectModel(BaseSettings.name) private baseModulModel: Model<BaseSettingsDocument>,
    @Inject('PUB_SUB') private   _pubSub: PubSubEngine
  ) {}

  async getBaseModuleById(id: any): Promise<BaseSettingsDocument> {
    return await this.baseModulModel.findById(id).exec();
  }

  async getActiveBaseModulesByType(type: string): Promise<BaseSettingsDocument[]> {
    return await this.baseModulModel.find({isActive: true, type: type}).sort({title: 1, updatedAt: -1 }).collation({locale: 'tr'}).exec();
  }

  async getActiveBaseModulesByBasecat(basekat: string): Promise<BaseSettingsDocument[]> {
    return await this.baseModulModel.find({isActive: true, basekat: basekat}).sort({title: 1, updatedAt: -1 }).collation({locale: 'tr'}).exec();
  }

  async getBaseModulesPagintaion(args: FetchPaginationData): Promise<BaseSettingsPagination> {
    const {search, sort, order, page, size, status, filter, type, selectedIds} = args;
    let query = {};
    if(search) {
      query = {$or: regexpSearch(['title'], search)};
    }

    if(type) {
      query = {...query, type: type};
    }    

    if(selectedIds && selectedIds.length > 0) {
      query = {...query, _id: {$in: selectedIds}};
    }

    if(filter && filter != '') {
      const filterObj = JSON.parse(filter);
      if(filterObj.status) {
        query = {...query, isActive: (filterObj.status == '1')? true : false };
      }

    }

    if(status && status != '0') {
      query = {...query, isActive: (status == '1')? true : false};
    }

    const ordertpye = order == 'asc'? 1 : -1;
    const totalData = await this.baseModulModel.find(query).countDocuments();
    const returnData = await this.baseModulModel.find(query).skip(page * size).limit(size).sort({[sort]: ordertpye}).populate('basekat').collation({locale: 'tr'}).exec();
    const pagination = {
        length    : totalData,
        size      : size,
        page      : page,
        lastPage  : Math.ceil(totalData / size),
        startIndex: size * page,
        endIndex  : (size * page) + returnData.length - 1
    }
    return {pagination, items: returnData};
  }

  async getBaseModulesCount(args: FetchPaginationData): Promise<ReturnCauntData> {
    const {filter, type} = args;
    let query = {};
    let query1 = {};
    let query2 = {};    
    if(filter && filter != '') {
      const filterObj = JSON.parse(filter);
        if(filterObj.status) {
          query = {...query, isActive: (filterObj.status == '1')? true : false };
        }
      }

      if(type) {
        query = {...query, type: type};
  
      }

      query1 = {...query, isActive: true };
      query2 = {...query, isActive: false };
      const [count1, count2] = await Promise.all([
        this.baseModulModel.find(query1).countDocuments(),
        this.baseModulModel.find(query2).countDocuments()
      ]);
    return {count1, count2};
  }

  async create(): Promise<BaseSettingsDocument> {
    return await new this.baseModulModel();
  }

  async update(updateBasemoduleInput: UpdateBasesettingInput): Promise<BaseSettingsDocument> {
    const  {id, siraNo, type } = updateBasemoduleInput
    const record = await this.baseModulModel.findById(id).exec();

    if(siraNo) {

      updateBasemoduleInput.siraNo =  record && siraNo > record.siraNo ? siraNo + 1 : siraNo;

    }

    const returnData = await this.baseModulModel.findByIdAndUpdate(id, updateBasemoduleInput, {
      new: true,
      upsert: true
    }).populate('basekat');

    await this._pubSub.publish('newSettingSub', { newSettingSub: returnData });


    const forms = await this.baseModulModel.find({type: type}).sort({siraNo: 1, updatedAt: -1 }).exec()
      let i = 0;
      forms.forEach(async element => {
          i = i + 1;
          element.siraNo = i;
          await element.save();
      });
    return returnData;
  }
}
