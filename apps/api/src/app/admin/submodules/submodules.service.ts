import { Injectable } from '@nestjs/common'
import { CreateSubmoduleInput } from './dto/create-submodule.input'
import { UpdateSubmoduleInput } from './dto/update-submodule.input'
import { SubModules, SubModulesDocument, SubModulesPagination } from './entities/submodule.entity'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { FetchPaginationData, ReturnCauntData, ReturnIsOkData, regexpSearch } from '../../_core/helpers/functions'
import { PermissionsService } from '../permissions/permissions.service'
import { UpdatePermissionInput } from '../permissions/dto/update-permission.input'

@Injectable()
export class SubmodulesService {
  constructor(
    @InjectModel(SubModules.name) private baseModulModel: Model<SubModulesDocument>,
    private _permissionService: PermissionsService,

  ) {}

  async getSubModules(search = ""): Promise<SubModulesDocument[]> {

    let query = {};

    if(search) { query = {$or: regexpSearch(['title'], search)}; }

    return this.baseModulModel.find(query).sort({basemodule: 1, siraNo: 1}).populate('basemodule').collation({locale: 'tr'}).exec();

  }
  
  async getBaseModulesPagintaion(args: FetchPaginationData): Promise<SubModulesPagination> {
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
    const returnData = await this.baseModulModel.find(query).skip(page * size).limit(size).sort({[sort]: ordertpye}).populate('basemodule').collation({locale: 'tr'}).exec();
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

  async create(): Promise<SubModulesDocument> {
    return await new this.baseModulModel();
  }

  async update(updateBasemoduleInput: UpdateSubmoduleInput): Promise<any> {
    const  {id, title, type, link, basemodule, isActive, siraNo, createPerm } = updateBasemoduleInput
    const record = await this.baseModulModel.findById(id).exec();

    const filter = { _id: id };
    const update = { _id: id, title, type: 'basic', link, basemodule, isActive, siraNo:  (record && siraNo && siraNo > record.siraNo) ? siraNo + 1 : siraNo };
    const returnData = await this.baseModulModel.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true
    });
    const forms = await this.baseModulModel.find({basemodule: basemodule}).sort({siraNo: 1, updatedAt: -1 }).exec()
      let i = 0;
      forms.forEach(async element => {
          i = i + 1;
          element.siraNo = i;
          await element.save();
      });

      if (createPerm) {
        const izindata1_id = await this._permissionService.create();
        const izindata1 = new UpdatePermissionInput();

        izindata1.id = izindata1_id._id.toString();
        izindata1.title = title + ' Listeleme';
        izindata1.basemodule = basemodule;
        izindata1.submodule = returnData._id.toString();
        izindata1.isActive = true;

        await this._permissionService.update(izindata1);

        const izindata2_id = await this._permissionService.create();

        const izindata2 = new UpdatePermissionInput();
        izindata2.id = izindata2_id._id.toString();
        izindata2.title = title + ' Ekleme / Düzenleme';
        izindata2.basemodule = basemodule;
        izindata2.submodule = returnData._id.toString();
        izindata2.isActive = true;

        await this._permissionService.update(izindata2);

      }

    const returnData1 = await this.baseModulModel.findById(id).populate('basemodule').exec();
    return returnData1;
  }

  async updateMulti(updateBasemoduleInput: UpdateSubmoduleInput): Promise<ReturnIsOkData> {
    const  { isActive, updateIds } = updateBasemoduleInput
    const filter = { _id: {$in: updateIds} };
    const update = {  isActive };
    const returnData = await this.baseModulModel.updateMany(filter, update).exec();
   
    return {isOk: 'success'};
  }

  async findAllByBaseId(baseId: string): Promise<SubModulesDocument[]> {
    return await this.baseModulModel.find({basemodule: baseId, isActive: true}).sort({title: 1}).collation({locale: 'tr'}).exec();
  }
}
