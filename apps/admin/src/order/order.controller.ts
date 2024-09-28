import { ToolsService } from '@app/tools';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly toolsService: ToolsService,
  ) {}

  // Get all orders
  @Get('/')
  @ApiOperation({ summary: '订单列表' })
  async findAll() {
    const result = await this.orderService.findAll();
    return {
      success: true,
      message: 'Orders retrieved successfully.',
      data: result,
    };
  }

  @Get('orderByUserId/:userId')
  @ApiOperation({ summary: '查询用户订单' })
  async orderByUserId(@Param('userId') userId: string) {
    const orders = await this.orderService.findAll({ userID: userId });
    return {
      success: true,
      message: 'Orders retrieved successfully.',
      data: orders,
    };
  }

  @Get('findOne')
  @ApiOperation({ summary: '查询订单' })
  async findOne(@Query('userId') userId: string) {
    const order = await this.orderService.findOne({ userId: userId });
    if (!order) {
      return { success: false, message: 'Order not found.' };
    }
    return {
      success: true,
      message: 'Order retrieved successfully.',
      data: order,
    };
  }

  // Create a new order
  @Post('/')
  @ApiOperation({ summary: '创建订单' })
  async create(@Body() body, @Res() res: Response) {
    const {
      userID,
      orderStatus,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
      couponCode,
      orderTotal,
      trackingUrl,
    } = body;
    if (
      !userID ||
      !items ||
      !totalPrice ||
      !shippingAddress ||
      !paymentMethod ||
      !orderTotal
    ) {
      return res.status(400).json({
        success: false,
        message:
          'User ID, items, totalPrice, shippingAddress, paymentMethod, and orderTotal are required.',
      });
    }

    await this.orderService.create({
      userID,
      orderStatus,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
      couponCode,
      orderTotal,
      trackingUrl,
    });
    res.json({
      success: true,
      message: 'Order created successfully.',
      data: null,
    });
  }

  // Update an order
  @Put('/:id')
  @ApiOperation({ summary: '编辑订单' })
  async update(
    @Param('id') orderID: string,
    @Body() body,
    @Res() res: Response,
  ) {
    const { orderStatus, trackingUrl } = body;
    if (!orderStatus) {
      return res
        .status(400)
        .json({ success: false, message: 'Order Status required.' });
    }

    const updatedOrder = await this.orderService.update(orderID, {
      orderStatus,
      trackingUrl,
    });

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found.' });
    }

    res.json({
      success: true,
      message: 'Order updated successfully.',
      data: null,
    });
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除订单' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const deletedOrder = await this.orderService.delete(id);
    if (!deletedOrder) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, message: 'Order deleted successfully.' });
  }
}
