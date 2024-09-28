import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '@app/db/schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async findAll(body?) {
    return await this.notificationModel.find(body).sort({ _id: -1 });
  }

  async findOne(id) {
    const u = await this.notificationModel
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
    const u = await this.notificationModel.findOne({ where: { title } });

    if (u) {
      throw new BadRequestException({ code: 400, msg: '用户已经注册' });
    }
    return await this.notificationModel.create(user);
  }

  async update(id, user) {
    return await this.notificationModel.findByIdAndUpdate({ _id: id }, user, {
      new: true,
    });
  }

  async delete(id) {
    return await this.notificationModel.findByIdAndDelete(id);
  }

  getModel() {
    return this.notificationModel;
  }
}
