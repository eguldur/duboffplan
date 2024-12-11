import { Inject, Injectable } from '@nestjs/common';
import { CreateMcompanyInput } from './dto/create-mcompany.input';
import { UpdateMcompanyInput } from './dto/update-mcompany.input';
import { InjectModel } from '@nestjs/mongoose';
import { MCompany, MCompanyDocument, MCompanyPagination } from './entities/mcompany.entity';
import { PubSubEngine } from 'graphql-subscriptions';
import { Model } from 'mongoose';
import { FetchPaginationData, ReturnCauntData, regexpSearch } from '../_core/helpers/functions';
import { UpdateBasesettingInput } from '../settings/basesettings/dto/update-base-setting.input';


@Injectable()
export class McompanyService {
  constructor(
    @InjectModel(MCompany.name) private baseModulModel: Model<MCompanyDocument>,
    @Inject('PUB_SUB') private   _pubSub: PubSubEngine
  ) {}

  async getBaseModuleById(id: any): Promise<MCompanyDocument> {
    return await this.baseModulModel.findById(id).exec();
  }

  async getActiveBaseModulesByType(type: string): Promise<MCompanyDocument[]> {
    return await this.baseModulModel.find({isActive: true, type: type}).sort({title: 1, updatedAt: -1 }).collation({locale: 'tr'}).exec();
  }

  async getActiveBaseModulesByBasecat(basekat: string): Promise<MCompanyDocument[]> {
    return await this.baseModulModel.find({isActive: true, basekat: basekat}).sort({title: 1, updatedAt: -1 }).collation({locale: 'tr'}).exec();
  }

  async getBaseModulesPagintaion(args: FetchPaginationData): Promise<MCompanyPagination> {
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
    const returnData = await this.baseModulModel.find(query).skip(page * size).limit(size).sort({[sort]: ordertpye}).collation({locale: 'tr'}).exec();
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

  async create(): Promise<MCompanyDocument> {
    return await new this.baseModulModel();
  }

  async update(updateBasemoduleInput: UpdateMcompanyInput): Promise<MCompanyDocument> {
    const  {id, type } = updateBasemoduleInput
    const returnData = await this.baseModulModel.findByIdAndUpdate(id, updateBasemoduleInput, {
      new: true,
      upsert: true
    });

    await this._pubSub.publish('newMCompanySub', { newMCompanySub: returnData });
    return returnData;
  }
}
