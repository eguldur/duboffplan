import { Injectable } from '@nestjs/common';
import { CreateBasemoduleInput } from './dto/create-basemodule.input';
import { UpdateBasemoduleInput } from './dto/update-basemodule.input';
import { InjectModel } from '@nestjs/mongoose';
import { BaseModules, BaseModulesDocument, BaseModulesPagination } from './entities/basemodule.entity';
import { Model } from 'mongoose';
import { FetchPaginationData, ReturnCauntData, ReturnIsOkData, regexpSearch } from '../../_core/helpers/functions';

@Injectable()
export class BasemodulesService {
  constructor(
    @InjectModel(BaseModules.name) private baseModulModel: Model<BaseModulesDocument>,
  ) {}

  async getBaseModulesPagintaion(args: FetchPaginationData): Promise<BaseModulesPagination> {    
    const {search, sort, order, page, size, status, filter, selectedIds} = args;
    let query = {};
    if(search) {
      query = {$or: regexpSearch(['title'], search)};
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
    const {filter} = args;
    let query = {};
    let query1 = {};
    let query2 = {};    
    if(filter && filter != '') {
      const filterObj = JSON.parse(filter);
        if(filterObj.status) {
          query = {...query, isActive: (filterObj.status == '1')? true : false };
        }
      }
      query1 = {...query, isActive: true };
      query2 = {...query, isActive: false };
      const [count1, count2] = await Promise.all([
        this.baseModulModel.find(query1).countDocuments(),
        this.baseModulModel.find(query2).countDocuments()
      ]);
    return {count1, count2};
  }

  async create(): Promise<BaseModulesDocument> {
    return await new this.baseModulModel();
  }

  async findAllActive(): Promise<BaseModulesDocument[]> {
    return await this.baseModulModel.find({isActive: true}).sort({title: 1}).collation({locale: 'tr'}).exec();
  }

  async update(updateBasemoduleInput: UpdateBasemoduleInput): Promise<BaseModulesDocument> {
    const  {id, title, subtitle, icon, isActive, siraNo } = updateBasemoduleInput
    const record = await this.baseModulModel.findById(id).exec();
    const filter = { _id: id };
    const update = { _id: id, title, subtitle, icon, isActive, siraNo:  (record && siraNo && siraNo > record.siraNo) ? siraNo + 1 : siraNo };
    const returnData = await this.baseModulModel.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true
    });
    const forms = await this.baseModulModel.find({}).sort({siraNo: 1, updatedAt: -1 }).exec()
      let i = 0;
      forms.forEach(async element => {
          i = i + 1;
          element.siraNo = i;
          await element.save();
      });
    return returnData;
  }

async updateMulti(updateBasemoduleInput: UpdateBasemoduleInput): Promise<ReturnIsOkData> {
  const  { isActive, updateIds } = updateBasemoduleInput
  const filter = { _id: {$in: updateIds} };
  const update = {  isActive };
  const returnData = await this.baseModulModel.updateMany(filter, update).exec();
 
  return {isOk: 'success'};
}
}

