import { Injectable } from '@nestjs/common';
import {
  BaseModules,
  BaseModulesDocument,
} from '../admin/basemodules/entities/basemodule.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CommonService {
  constructor(
    @InjectModel(BaseModules.name)
    private baseModulesModel: Model<BaseModulesDocument>,
  ) {}

  async getnavigation(user: any): Promise<BaseModulesDocument[]> {
    let permissions = [];
    if (
      user.role &&
      user.role.permissions &&
      user.role.permissions.length > 0
    ) {
      permissions = user.role.permissions;
    }

    const basemodules = await this.baseModulesModel
      .aggregate([
        { $match: { isActive: true } },
        {
          $lookup: {
            from: 'submodules',
            localField: '_id',
            foreignField: 'basemodule',
            as: 'children',
          },
        },
        { $unwind: '$children' },
        {
          $lookup: {
            from: 'permissions',
            localField: 'children._id',
            foreignField: 'submodule',
            as: 'permissions',
          },
        },
        { $sort: { siraNo: 1, 'children.siraNo': 1 } },
        {
          $project: {
            _id: 1,
            id: '$_id',
            title: 1,
            type: 1,
            icon: 1,
            siraNo: 1,
            children: {
              _id: 1,
              title: 1,
              type: 1,
              link: 1,
              siraNo: 1,
              isActive: 1,
            },
            permissions: {
              $size: {
                $filter: {
                  input: '$permissions',
                  as: 'permission',
                  cond: { $in: ['$$permission.permId', permissions] },
                },
              },
            },
          },
        },
        { $match: { 'children.isActive': { $eq: true } } },
        { $sort: { siraNo: 1, 'children.siraNo': 1 } },
        { $match: { permissions: { $gt: 0 } } },
        {
          $group: {
            _id: '$_id',
            id: { $first: '$_id' },
            siraNo: { $first: '$siraNo' },
            title: { $first: '$title' },
            icon: { $first: '$icon' },
            children: { $push: '$children' },
          },
        },
        { $sort: { siraNo: 1 } },
        {
          $project: {
            _id: 1,
            id: 1,
            title: 1,
            type: 'aside', // collapsable, aside
            icon: 1,
            siraNo: 1,
            children: {
              _id: 1,
              title: 1,
              type: 1,
              link: 1,
              siraNo: 1,
              isActive: 1,
            },
          },
        },
      ])
      .exec();

    basemodules.map((item) => {
      if (item.children.length === 1) {
        item.type = 'basic';
        item.link = item.children[0].link;
        delete item.children;
      } else if (item.children.length > 1) {
        item.children.map((child) => {
          child.id = child._id;
          delete child._id;
        });
      }
    });

    return basemodules;
  }
}
