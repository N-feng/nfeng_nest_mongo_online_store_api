import { Product } from '@app/db/schemas/product.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll() {
    return await this.productModel
      .find()
      .populate('proCategoryId', 'id name')
      .populate('proSubCategoryId', 'id name')
      .populate('proBrandId', 'id name')
      .populate('proVariantTypeId', 'id type')
      .populate('proVariantId', 'id name');
  }

  async findOne(id) {
    const u = await this.productModel.findById(id);
    if (!u) {
      throw new BadRequestException({
        code: 400,
        msg: 'Product not found.',
      });
    }
    return u;
  }

  async create(user) {
    const { title } = user;
    const u = await this.productModel.findOne({ where: { title } });

    if (u) {
      throw new BadRequestException({ code: 400, msg: '用户已经注册' });
    }
    return await this.productModel.create(user);
  }

  async update(id, user) {
    return await this.productModel.findByIdAndUpdate({ _id: id }, user);
  }

  async delete(id) {
    return await this.productModel.findByIdAndDelete(id);
  }

  getModel() {
    return this.productModel;
  }
}
