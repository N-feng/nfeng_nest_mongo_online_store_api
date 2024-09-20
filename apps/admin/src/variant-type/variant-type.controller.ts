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
import { VariantTypeService } from './variant-type.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateSubCategoryDto } from '../sub-category/dto/subCategory.dto';

@Controller('variant-type')
export class VariantTypeController {
  constructor(private readonly variantTypeService: VariantTypeService) {}

  @Get('/')
  @ApiOperation({ summary: '品牌列表' })
  async findAll() {
    const result = await this.variantTypeService.findAll();
    return {
      success: true,
      message: 'Brands retrieved successfully.',
      data: result,
    };
  }

  @Get('findOne')
  @ApiOperation({ summary: '查询品牌' })
  async findOne(@Query('id') id: string) {
    const user = await this.variantTypeService.findOne(id);
    return { code: 200, data: user };
  }

  @Post('/')
  @ApiOperation({ summary: '创建品牌' })
  async create(@Body() body: CreateSubCategoryDto) {
    await this.variantTypeService.create(body);
    return {
      success: true,
      message: 'Sub-category created successfully.',
      data: null,
    };
  }

  @Put('/:id')
  @ApiOperation({ summary: '编辑品牌' })
  async update(@Param('id') id: string, @Body() body) {
    await this.variantTypeService.update(id, body);
    return {
      success: true,
      message: 'Brands updated successfully.',
      data: null,
    };
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除品牌' })
  async remove(@Param('id') id: string) {
    await this.variantTypeService.delete(id);
    return { success: true, message: 'Brands deleted successfully.' };
  }
}
