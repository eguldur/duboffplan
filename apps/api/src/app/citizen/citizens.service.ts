import { Inject, Injectable } from '@nestjs/common';
import { Citizen, CitizenDocument, CitizenPagination } from './entities/citizen.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FetchPaginationData, regexpSearch, ReturnCauntData } from '../_core/helpers/functions';
import { UpdateCitizenInput } from './dto/update-citizen.input';
import { PubSubEngine } from 'graphql-subscriptions';
import { Auth } from '../auth/entities/auth.entity';
import { UploadFromBase64Service } from '../_core/services/upload-from-base-64.service';

@Injectable()
export class CitizenService {
  constructor(
    @InjectModel(Citizen.name) private citizenModel: Model<CitizenDocument>,
    private readonly imageBase64Service: UploadFromBase64Service,
    @Inject('PUB_SUB') private _pubSub: PubSubEngine,
  ) {}

  async getActiveBaseModulesByType(type: string): Promise<CitizenDocument[]> {
    return await this.citizenModel.find({ isActive: true, type: type }).sort({ title: 1, updatedAt: -1 }).exec();
  }

  async getBaseModulesPagintaion(args: FetchPaginationData): Promise<CitizenPagination> {
    const { search, sort, order, page, size, status, filter, type, selectedIds } = args;
    let query = {};
    if (search) {
      query = { $or: regexpSearch(['fullName'], search) };
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
    const totalData = await this.citizenModel.find(query).countDocuments();
    const returnData = await this.citizenModel
      .find(query)
      .populate('unvan developer project')
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
    const [count1, count2] = await Promise.all([this.citizenModel.find(query1).countDocuments(), this.citizenModel.find(query2).countDocuments()]);
    return { count1, count2 };
  }

  async create(): Promise<CitizenDocument> {
    return await new this.citizenModel();
  }

  async update(updateCitizenInput: UpdateCitizenInput, user: Auth, changeAvatar: boolean): Promise<CitizenDocument> {
    const record = await this.citizenModel.findById(updateCitizenInput.id).exec();
    const updatedData: any = { ...updateCitizenInput };

    if (changeAvatar) {
        updateCitizenInput.avatar = await this.imageBase64Service.uploadBase64Sharp(
        updateCitizenInput.avatar
      );
    }

    let returnData: any = {};

    if (record) {
      updatedData.updater = user.id;
      returnData = await this.citizenModel.findByIdAndUpdate(updateCitizenInput.id, updatedData, {
        new: true,
      }).populate('unvan developer project').exec();
    } else {
      updatedData.creator = user.id;
      updatedData.updater = user.id;
      updatedData._id = updateCitizenInput.id;
      const savedRecord = await this.citizenModel.create(updatedData);
      returnData = await this.citizenModel.findById(savedRecord._id).populate('unvan developer project').exec();
    }
    this.setCitizenSearchText(returnData._id);
    await this._pubSub.publish('citizenSub', { citizenSub: returnData });
    return returnData;
  }

  async getCitizenById(id: string): Promise<any> {
    const citizen = await this.citizenModel.findById(id).exec();
    return citizen;
  }

  async setCitizenSearchText(id: string): Promise<any> {
    const citizen = await this.citizenModel
      .findById(id)
      .populate('unvan developer project')
      .exec();


    let phonetext = '';
    let emailtext = '';
    let socialmediatext = '';
    let developertext = '';
    let projecttext = '';
    if (citizen.phone && citizen.phone.length > 0) {
      citizen.phone.forEach((phone) => {
        phonetext += phone.phone + ' ';
      });
    }

    if (citizen.email) {
      emailtext = citizen.email;
    }

    if (citizen.socialMediaAccounts && citizen.socialMediaAccounts.length > 0) {
      citizen.socialMediaAccounts.forEach((socialMediaAccount) => {
        socialmediatext += socialMediaAccount.username + ' ';
      });
    }

    if (citizen.developer && citizen.developer.length > 0) {
      citizen.developer.forEach((developer) => {
        developertext += developer.title + ' ';
      });
    }

    if (citizen.project && citizen.project.length > 0) {
      citizen.project.forEach((project) => {
        projecttext += project.title + ' ';
      });
    }

    const searchtext = `${citizen.fullName}${phonetext ? ' ' + phonetext : ''}${emailtext ? ' ' + emailtext : ''}${socialmediatext ? ' ' + socialmediatext : ''}${citizen.unvan ? ' ' + citizen.unvan.title : ''}`;
    if (citizen) {
      citizen.searchtext = searchtext;
      await citizen.save();
    }
    return citizen;
  }

  async searchCitizen(search: string): Promise<CitizenDocument[]> {
    return await this.citizenModel
      .find({ $text: { $search: search, $caseSensitive: false, $diacriticSensitive: false, $language: 'tr' } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(10)
      .exec();
  }
}
