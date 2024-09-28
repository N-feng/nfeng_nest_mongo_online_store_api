import { Category } from '@app/db/schemas/category.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async findAll() {
    return await this.categoryModel.find();
  }

  async findOne(id) {
    const u = await this.categoryModel.findOne({
      where: { id },
      // include: [Access],
    });
    if (!u) {
      throw new BadRequestException({ code: 400, msg: 'Category not found.' });
    }
    return u;
  }

  async create(user) {
    const { title } = user;
    const u = await this.categoryModel.findOne({ where: { title } });

    if (u) {
      throw new BadRequestException({ code: 400, msg: '用户已经注册' });
    }
    return await this.categoryModel.create(user);
  }

  async update(id, user) {
    return await this.categoryModel.findByIdAndUpdate({ _id: id }, user, {
      new: true,
    });
  }

  async delete(id) {
    return await this.categoryModel.findByIdAndDelete(id);
  }

  getModel() {
    return this.categoryModel;
  }
}
