import { Poster } from '@app/db/schemas/poster.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PosterService {
  constructor(@InjectModel(Poster.name) private posterModel: Model<Poster>) {}

  async findAll() {
    return await this.posterModel.find();
  }

  async findOne(id) {
    const u = await this.posterModel.findOne({
      where: { id },
      // include: [Access],
    });
    if (!u) {
      throw new BadRequestException({ code: 400, msg: 'Poster not found.' });
    }
    return u;
  }

  async create(user) {
    const { title } = user;
    const u = await this.posterModel.findOne({ where: { title } });

    if (u) {
      throw new BadRequestException({ code: 400, msg: '用户已经注册' });
    }
    return await this.posterModel.create(user);
  }

  async update(id, user) {
    return await this.posterModel.findByIdAndUpdate({ _id: id }, user);
  }

  async delete(id) {
    return await this.posterModel.findByIdAndDelete(id);
  }

  getModel() {
    return this.posterModel;
  }
}
