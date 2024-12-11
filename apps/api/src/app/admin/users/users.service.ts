import { ConflictException, Injectable } from '@nestjs/common'
import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'
import { Auth, AuthDocument } from '../../auth/entities/auth.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FetchPaginationData, ReturnCauntData, ReturnIsOkData, regexpSearch } from '../../_core/helpers/functions';
import { UsersPagination } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Auth.name) private baseModulModel: Model<AuthDocument>,
  ) {}


  
  async getBaseModulesPagintaion(args: FetchPaginationData): Promise<UsersPagination> {
    const {search, sort, order, page, size, status, filter, selectedIds} = args;
    let query = {};
    if(search) {
      query = {$or: regexpSearch(['firstname', 'lastname'], search)};
    }
    if(selectedIds && selectedIds.length > 0) {
      query = {...query, _id: {$in: selectedIds}};
    }
    if(filter && filter != '') {
      const filterObj = JSON.parse(filter);
      if(filterObj.role) {
        query = {...query, role: filterObj.role};
      }

    }
    if(status && status != '0') {
      query = {...query, isActive: (status == '1')? true : false};
    }

    const ordertpye = order == 'asc'? 1 : -1;
    const totalData = await this.baseModulModel.find(query).countDocuments();
    const returnData = await this.baseModulModel.find(query).skip(page * size).limit(size).sort({[sort]: ordertpye}).populate('role').collation({locale: 'tr'}).exec();
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
      if(filterObj.role) {
        query = {...query, role: filterObj.role};
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

  async create(): Promise<AuthDocument> {
    return await new this.baseModulModel();
  }

  async update(updateBasemoduleInput: UpdateUserInput): Promise<any> {
    try {
      const  {id, firstname, lastname, email, isActive, isEmailActive, password, role } = updateBasemoduleInput
      const record = await this.baseModulModel.findById(id).exec();
      let update: any = { _id: id, firstname, lastname, email, isActive, isEmailActive, role};
      if(password && password != "") {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        update = { _id: id, firstname, lastname, email, isActive, isEmailActive, password: hashedPassword, role};
      }
      const filter = { _id: id };
      const returnData = await this.baseModulModel.findOneAndUpdate(filter, update, {
        new: true,  
        upsert: true
      }).populate('role');
      return returnData;
    } catch (error) {      
      throw new ConflictException(error);

    }
    
  }

  async updateMulti(updateBasemoduleInput: UpdateUserInput): Promise<ReturnIsOkData> {
    const  { isActive, updateIds } = updateBasemoduleInput
    const filter = { _id: {$in: updateIds} };
    const update = {  isActive };
    const returnData = await this.baseModulModel.updateMany(filter, update).exec();
   
    return {isOk: 'success'};
  }
}
