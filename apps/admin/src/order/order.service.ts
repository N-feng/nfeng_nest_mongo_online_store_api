import { Order } from '@app/db/schemas/order.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async findAll(body?) {
    return await this.orderModel
      .find(body)
      .populate('couponCode', 'id couponCode discountType discountAmount')
      .populate('userID', 'id name')
      .sort({ _id: -1 });
  }

  async findOne(id) {
    const u = await this.orderModel
      .findById(id)
      .populate('couponCode', 'id couponCode discountType discountAmount')
      .populate('userID', 'id name');
    console.log('u: ', u);
    if (!u) {
      throw new BadRequestException({
        code: 400,
        msg: 'Order not found.',
      });
    }
    return u;
  }

  async create(user) {
    const { title } = user;
    const u = await this.orderModel.findOne({ where: { title } });

    if (u) {
      throw new BadRequestException({ code: 400, msg: '用户已经注册' });
    }
    return await this.orderModel.create(user);
  }

  async update(id, user) {
    return await this.orderModel.findByIdAndUpdate({ _id: id }, user, {
      new: true,
    });
  }

  async delete(id) {
    return await this.orderModel.findByIdAndDelete(id);
  }

  getModel() {
    return this.orderModel;
  }
}
