import { User } from '@app/db/schemas/user';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll() {
    return await this.userModel
      .find()
      .populate('applicableCategory', 'id name')
      .populate('applicableSubCategory', 'id name')
      .populate('applicableProduct', 'id name');
  }

  async findOne(user) {
    const { name } = user;
    const u = await this.userModel.findOne({
      name,
      // include: [Access],
    });
    if (!u) {
      throw new BadRequestException({ code: 400, msg: 'User not found.' });
    }
    return u;
  }

  async create(user) {
    const { title } = user;
    const u = await this.userModel.findOne({ where: { title } });

    if (u) {
      throw new BadRequestException({ code: 400, msg: '用户已经注册' });
    }
    return await this.userModel.create(user);
  }

  async update(id, user) {
    return await this.userModel.findByIdAndUpdate({ _id: id }, user);
  }

  async delete(id) {
    return await this.userModel.findByIdAndDelete(id);
  }

  getModel() {
    return this.userModel;
  }
}
