import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateSubCategoryDto } from '../sub-category/dto/subCategory.dto';
import { VariantService } from './variant.service';

@Controller('variants')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Get('/')
  @ApiOperation({ summary: '品牌列表' })
  async findAll() {
    const result = await this.variantService.findAll();
    return {
      success: true,
      message: 'Brands retrieved successfully.',
      data: result,
    };
  }

  @Get('findOne')
  @ApiOperation({ summary: '查询品牌' })
  async findOne(@Query('id') id: string) {
    const user = await this.variantService.findOne(id);
    return { code: 200, data: user };
  }

  @Post('/')
  @ApiOperation({ summary: '创建品牌' })
  async create(@Body() body: CreateSubCategoryDto) {
    await this.variantService.create(body);
    return {
      success: true,
      message: 'Sub-category created successfully.',
      data: null,
    };
  }

  @Put('/:id')
  @ApiOperation({ summary: '编辑品牌' })
  async update(@Param('id') id: string, @Body() body) {
    await this.variantService.update(id, body);
    return {
      success: true,
      message: 'Brands updated successfully.',
      data: null,
    };
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除品牌' })
  async remove(@Param('id') id: string) {
    await this.variantService.delete(id);
    return { success: true, message: 'Brands deleted successfully.' };
  }
}
