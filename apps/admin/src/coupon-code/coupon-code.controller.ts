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
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { CouponCodeService } from './coupon-code.service';
import { ToolsService } from '@app/tools';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { ProductService } from '../product/product.service';

@Controller('couponCodes')
export class CouponCodeController {
  constructor(
    private readonly couponCodeService: CouponCodeService,
    private readonly productService: ProductService,
    private readonly toolsService: ToolsService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: '优惠券列表' })
  async findAll() {
    const result = await this.couponCodeService.findAll();
    return {
      success: true,
      message: 'Coupons retrieved successfully.',
      data: result,
    };
  }

  @Get('findOne')
  @ApiOperation({ summary: '查询优惠券' })
  async findOne(@Query('id') id: string) {
    const user = await this.couponCodeService.findOne({ id });
    return { code: 200, data: user };
  }

  @Post('/')
  @ApiOperation({ summary: '创建优惠券' })
  async create(@Body() body, @Res() res: Response) {
    const {
      couponCode,
      discountType,
      discountAmount,
      minimumPurchaseAmount,
      endDate,
      status,
      applicableCategory,
      applicableSubCategory,
      applicableProduct,
    } = body;
    if (
      !couponCode ||
      !discountType ||
      !discountAmount ||
      !endDate ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Code, discountType, discountAmount, endDate, and status are required.',
      });
    }
    await this.couponCodeService.create({
      couponCode,
      discountType,
      discountAmount,
      minimumPurchaseAmount,
      endDate,
      status,
      applicableCategory,
      applicableSubCategory,
      applicableProduct,
    });
    res.json({
      success: true,
      message: 'Coupons created successfully.',
      data: null,
    });
  }

  @Put('/:id')
  @ApiOperation({ summary: '编辑优惠券' })
  @UseInterceptors(FileInterceptor('img'))
  async update(@Param('id') id: string, @Body() body, @Res() res: Response) {
    const couponID = id;
    const {
      couponCode,
      discountType,
      discountAmount,
      minimumPurchaseAmount,
      endDate,
      status,
      applicableCategory,
      applicableSubCategory,
      applicableProduct,
    } = body;
    console.log(body);
    if (
      !couponCode ||
      !discountType ||
      !discountAmount ||
      !endDate ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message:
          'CouponCode, discountType, discountAmount, endDate, and status are required.',
      });
    }

    const updatedCoupon = await this.couponCodeService.update(couponID, {
      couponCode,
      discountType,
      discountAmount,
      minimumPurchaseAmount,
      endDate,
      status,
      applicableCategory,
      applicableSubCategory,
      applicableProduct,
    });

    if (!updatedCoupon) {
      return res
        .status(404)
        .json({ success: false, message: 'Coupon not found.' });
    }

    res.json({
      success: true,
      message: 'Coupon updated successfully.',
      data: null,
    });
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除优惠券' })
  async remove(@Param('id') id: string) {
    await this.couponCodeService.delete(id);
    return { success: true, message: 'Coupons deleted successfully.' };
  }

  @Post('check-coupon')
  @ApiOperation({ summary: '检查优惠券' })
  async checkCoupon(@Body() body, @Res() res: Response) {
    const { couponCode, productIds, purchaseAmount } = body;

    // Find the coupon with the provided coupon code
    const coupon = await this.couponCodeService.findOne({ couponCode });

    // If coupon is not found, return false
    if (!coupon) {
      return res.json({ success: false, message: 'Coupon not found.' });
    }

    // Check if the coupon is expired
    const currentDate = new Date();
    if (coupon.endDate < currentDate) {
      return res.json({ success: false, message: 'Coupon is expired.' });
    }

    // Check if the coupon is active
    if (coupon.status !== 'active') {
      return res.json({ success: false, message: 'Coupon is inactive.' });
    }

    // Check if the purchase amount is greater than the minimum purchase amount specified in the coupon
    if (
      coupon.minimumPurchaseAmount &&
      purchaseAmount < coupon.minimumPurchaseAmount
    ) {
      return res.json({
        success: false,
        message: 'Minimum purchase amount not met.',
      });
    }

    // Check if the coupon is applicable for all orders
    if (
      !coupon.applicableCategory &&
      !coupon.applicableSubCategory &&
      !coupon.applicableProduct
    ) {
      return res.json({
        success: true,
        message: 'Coupon is applicable for all orders.',
        data: coupon,
      });
    }

    // Fetch the products from the database using the provided product IDs
    const products = await this.productService
      .getModel()
      .find({ _id: { $in: productIds } });

    // Check if any product in the list is not applicable for the coupon
    const isValid = products.every((product) => {
      if (
        coupon.applicableCategory &&
        coupon.applicableCategory.toString() !==
          product.proCategoryId.toString()
      ) {
        return false;
      }
      if (
        coupon.applicableSubCategory &&
        coupon.applicableSubCategory.toString() !==
          product.proSubCategoryId.toString()
      ) {
        return false;
      }
      if (
        coupon.applicableProduct &&
        !product.proVariantId.includes(coupon.applicableProduct.toString())
      ) {
        return false;
      }
      return true;
    });

    if (isValid) {
      return res.json({
        success: true,
        message: 'Coupon is applicable for the provided products.',
        data: coupon,
      });
    } else {
      return res.json({
        success: false,
        message: 'Coupon is not applicable for the provided products.',
      });
    }
  }
}
