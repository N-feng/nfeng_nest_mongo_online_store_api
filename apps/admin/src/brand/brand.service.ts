import { Brand } from '@app/db/schemas/brand.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  async findAll() {
    return await this.brandModel
      .find()
      .populate('subcategoryId')
      .sort({ subcategoryId: 1 });
  }

  async findOne(id) {
    const u = await this.brandModel.findOne({
      where: { id },
      // include: [Access],
    });
    if (!u) {
      throw new BadRequestException({
        code: 400,
        msg: 'Brand not found.',
      });
    }
    return u;
  }

  async create(user) {
    const { title } = user;
    const u = await this.brandModel.findOne({ where: { title } });

    if (u) {
      throw new BadRequestException({ code: 400, msg: '用户已经注册' });
    }
    return await this.brandModel.create(user);
  }

  async update(id, user) {
    return await this.brandModel.findByIdAndUpdate({ _id: id }, user);
  }

  async delete(id) {
    return await this.brandModel.findByIdAndDelete(id);
  }

  getModel() {
    return this.brandModel;
  }
}
