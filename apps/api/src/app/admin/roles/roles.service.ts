import { Injectable } from '@nestjs/common'
import { CreateRoleInput } from './dto/create-role.input'
import { UpdateRoleInput } from './dto/update-role.input'
import { Roles, RolesDocument, RolesPagination } from './entities/role.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FetchPaginationData, ReturnCauntData, ReturnIsOkData, regexpSearch } from '../../_core/helpers/functions';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Roles.name) private baseModulModel: Model<RolesDocument>,
  ) {}

  async getRoleById(id: string): Promise<any> {
    return this.baseModulModel.findById(id).exec();
  }

  async rolesActive(): Promise<any> {
    return this.baseModulModel.find({isActive: true}).sort({title: 1}).collation({locale: 'tr'}).exec();
  }

  async getBaseModulesPagintaion(args: FetchPaginationData): Promise<RolesPagination> {
    const {search, sort, order, page, size, status, filter, selectedIds} = args;
    let query = {};
    if(search) {
      query = {$or: regexpSearch(['title'], search)};
    }
    if(selectedIds && selectedIds.length > 0) {
      query = {...query, _id: {$in: selectedIds}};
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
    
      query1 = {...query, isActive: true };
      query2 = {...query, isActive: false };
      const [count1, count2] = await Promise.all([
        this.baseModulModel.find(query1).countDocuments(),
        this.baseModulModel.find(query2).countDocuments()
      ]);
    return {count1, count2};
  }

  async create(): Promise<RolesDocument> {
    return await new this.baseModulModel();
  }

  async update(updateBasemoduleInput: UpdateRoleInput): Promise<any> {
    const  {id, title, isActive, permissions } = updateBasemoduleInput
    const record = await this.baseModulModel.findById(id).exec();
    const filter = { _id: id };
    let update: any = { _id: id, title, isActive, permissions };

    if(!permissions) {
      update = { _id: id, title, isActive };
    }
    const returnData = await this.baseModulModel.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true
    });
   
    return returnData;
  }

  async updateMulti(updateBasemoduleInput: UpdateRoleInput): Promise<ReturnIsOkData> {
    const  { isActive, updateIds } = updateBasemoduleInput
    const filter = { _id: {$in: updateIds} };
    const update = {  isActive };
    const returnData = await this.baseModulModel.updateMany(filter, update).exec();
   
    return {isOk: 'success'};
  }
}
