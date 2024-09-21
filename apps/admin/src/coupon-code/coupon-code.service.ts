import { Coupon } from '@app/db/schemas/couponCode';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CouponCodeService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) {}

  async findAll() {
    return await this.couponModel
      .find()
      .populate('applicableCategory', 'id name')
      .populate('applicableSubCategory', 'id name')
      .populate('applicableProduct', 'id name');
  }

  async findOne(id) {
    const u = await this.couponModel.findOne({
      where: { id },
      // include: [Access],
    });
    if (!u) {
      throw new BadRequestException({ code: 400, msg: 'Coupon not found.' });
    }
    return u;
  }

  async create(user) {
    const { title } = user;
    const u = await this.couponModel.findOne({ where: { title } });

    if (u) {
      throw new BadRequestException({ code: 400, msg: '用户已经注册' });
    }
    return await this.couponModel.create(user);
  }

  async update(id, user) {
    return await this.couponModel.findByIdAndUpdate({ _id: id }, user);
  }

  async delete(id) {
    return await this.couponModel.findByIdAndDelete(id);
  }

  getModel() {
    return this.couponModel;
  }
}
