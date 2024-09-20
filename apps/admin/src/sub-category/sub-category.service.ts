import { SubCategory } from '@app/db/schemas/subCategory.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
  ) {}

  async findAll() {
    return await this.subCategoryModel
      .find()
      .populate('categoryId')
      .sort({ categoryId: 1 });
  }

  async findOne(id) {
    const u = await this.subCategoryModel.findOne({
      where: { id },
      // include: [Access],
    });
    if (!u) {
      throw new BadRequestException({
        code: 400,
        msg: 'subCategory not found.',
      });
    }
    return u;
  }

  async create(user) {
    const { title } = user;
    const u = await this.subCategoryModel.findOne({ where: { title } });

    if (u) {
      throw new BadRequestException({ code: 400, msg: '用户已经注册' });
    }
    return await this.subCategoryModel.create(user);
  }

  async update(id, user) {
    return await this.subCategoryModel.findByIdAndUpdate({ _id: id }, user);
  }

  async delete(id) {
    return await this.subCategoryModel.findByIdAndDelete(id);
  }

  getModel() {
    return this.subCategoryModel;
  }
}
