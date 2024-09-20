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
import { SubCategoryService } from './sub-category.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateSubCategoryDto } from './dto/subCategory.dto';

@Controller('subCategories')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get('/')
  @ApiOperation({ summary: '子类列表' })
  async findAll() {
    const result = await this.subCategoryService.findAll();
    return {
      success: true,
      message: 'Sub-categories retrieved successfully.',
      data: result,
    };
  }

  @Get('findOne')
  @ApiOperation({ summary: '查询子类' })
  async findOne(@Query('id') id: string) {
    const user = await this.subCategoryService.findOne(id);
    return { code: 200, data: user };
  }

  @Post('/')
  @ApiOperation({ summary: '创建子类' })
  async create(@Body() body: CreateSubCategoryDto) {
    await this.subCategoryService.create(body);
    return {
      success: true,
      message: 'Sub-category created successfully.',
      data: null,
    };
  }

  @Put('/:id')
  @ApiOperation({ summary: '编辑子类' })
  async update(@Param('id') id: string, @Body() body) {
    await this.subCategoryService.update(id, body);
    return {
      success: true,
      message: 'Sub-categories updated successfully.',
      data: null,
    };
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除子类' })
  async remove(@Param('id') id: string) {
    await this.subCategoryService.delete(id);
    return { success: true, message: 'Sub-categories deleted successfully.' };
  }
}
