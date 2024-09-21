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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { CouponCodeService } from './coupon-code.service';
import { ToolsService } from '@app/tools';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';

@Controller('couponCodes')
export class CouponCodeController {
  constructor(
    private readonly couponCodeService: CouponCodeService,
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
    const user = await this.couponCodeService.findOne(id);
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
  async update(
    @Param('id') id: string,
    @Body() body,
    @UploadedFile() img: Express.Multer.File,
  ) {
    if (img) {
      const image = await this.toolsService.uploadFile(img, 'poster');
      await this.couponCodeService.update(id, { ...body, image: image });
      return {
        success: true,
        message: 'Coupons updated successfully.',
        data: null,
      };
    }

    return {
      success: true,
      message: 'Error updating Coupons: no img',
      data: null,
    };
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除优惠券' })
  async remove(@Param('id') id: string) {
    await this.couponCodeService.delete(id);
    return { success: true, message: 'Coupons deleted successfully.' };
  }
}
