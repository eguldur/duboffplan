import { Injectable } from '@nestjs/common'
import { CreatePermissionInput } from './dto/create-permission.input'
import { UpdatePermissionInput } from './dto/update-permission.input'
import { Permissions, PermissionsDocument, PermissionsPagination } from './entities/permission.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FetchPaginationData, ReturnCauntData, ReturnIsOkData, regexpSearch } from '../../_core/helpers/functions';
import { Model } from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permissions.name) private baseModulModel: Model<PermissionsDocument>,
  ) {}
  async getPermissions(): Promise<PermissionsDocument[]> {

    return this.baseModulModel.find().exec();
  }

  async getPermissionBySubModuleId(id: string): Promise<PermissionsDocument[]> {
    return this.baseModulModel.find({submodule: id}).exec();
  }
  async getBaseModulesPagintaion(args: FetchPaginationData): Promise<PermissionsPagination> {
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
      if(filterObj.basemodule) {
        query = {...query, basemodule: filterObj.basemodule};
      }

    }
    if(status && status != '0') {
      query = {...query, isActive: (status == '1')? true : false};
    }

    const ordertpye = order == 'asc'? 1 : -1;
    const totalData = await this.baseModulModel.find(query).countDocuments();
    const returnData = await this.baseModulModel.find(query).skip(page * size).limit(size).sort({[sort]: ordertpye}).populate('basemodule submodule').collation({locale: 'tr'}).exec();
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
      if(filterObj.basemodule) {
        query = {...query, basemodule: filterObj.basemodule};
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

  async create(): Promise<PermissionsDocument> {
    return await new this.baseModulModel();
  }

  async update(updateBasemoduleInput: UpdatePermissionInput): Promise<any> {
    const  {id, title, basemodule, submodule, isActive } = updateBasemoduleInput
    const record = await this.baseModulModel.findById(id).exec();
    const filter = { _id: id };
    let update: any = { _id: id, title, basemodule, submodule, isActive};


    if(!record) {
      const lastNum = await this.baseModulModel.findOne({}).sort({permId: -1}).exec();
      let permId = 1000;
      if(lastNum) {
        permId = lastNum.permId + 1;
      }
      update = { _id: id, title, basemodule, submodule, permId, isActive };
    }

    const returnData = await this.baseModulModel.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true
    });
    
    const returnData1 = await this.baseModulModel.findById(id).populate('basemodule submodule').exec();
    return returnData1;
  }

  async updateMulti(updateBasemoduleInput: UpdatePermissionInput): Promise<ReturnIsOkData> {
    const  { isActive, updateIds } = updateBasemoduleInput
    const filter = { _id: {$in: updateIds} };
    const update = {  isActive };
    const returnData = await this.baseModulModel.updateMany(filter, update).exec();
   
    return {isOk: 'success'};
  }

}
