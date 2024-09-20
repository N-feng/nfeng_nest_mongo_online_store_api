import { Variant } from '@app/db/schemas/variant.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class VariantService {
  constructor(
    @InjectModel(Variant.name) private variantModel: Model<Variant>,
  ) {}

  async findAll() {
    return await this.variantModel
      .find()
      .populate('variantTypeId')
      .sort({ variantTypeId: 1 });
  }

  async findOne(id) {
    const u = await this.variantModel.findOne({
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
    const u = await this.variantModel.findOne({ where: { title } });

    if (u) {
      throw new BadRequestException({ code: 400, msg: '用户已经注册' });
    }
    return await this.variantModel.create(user);
  }

  async update(id, user) {
    return await this.variantModel.findByIdAndUpdate({ _id: id }, user);
  }

  async delete(id) {
    return await this.variantModel.findByIdAndDelete(id);
  }

  getModel() {
    return this.variantModel;
  }
}
