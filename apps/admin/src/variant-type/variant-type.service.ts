import { VariantType } from '@app/db/schemas/variantType.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class VariantTypeService {
  constructor(
    @InjectModel(VariantType.name) private variantTypeModel: Model<VariantType>,
  ) {}

  async findAll() {
    return await this.variantTypeModel.find();
  }

  async findOne(id) {
    const u = await this.variantTypeModel.findOne({
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
    const u = await this.variantTypeModel.findOne({ where: { title } });

    if (u) {
      throw new BadRequestException({ code: 400, msg: '用户已经注册' });
    }
    return await this.variantTypeModel.create(user);
  }

  async update(id, user) {
    return await this.variantTypeModel.findByIdAndUpdate({ _id: id }, user);
  }

  async delete(id) {
    return await this.variantTypeModel.findByIdAndDelete(id);
  }

  getModel() {
    return this.variantTypeModel;
  }
}
