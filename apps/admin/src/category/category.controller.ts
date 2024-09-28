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
import { CategoryService } from './category.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ToolsService } from '@app/tools';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly toolsService: ToolsService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: '分类列表' })
  async findAll() {
    const result = await this.categoryService.findAll();
    return {
      success: true,
      message: 'Category retrieved successfully.',
      data: result,
    };
  }

  @Get('findOne')
  @ApiOperation({ summary: '查询分类' })
  async findOne(@Query('id') id: string) {
    const user = await this.categoryService.findOne(id);
    return { code: 200, data: user };
  }

  // Create a new category with image upload
  @Post('/')
  @ApiOperation({ summary: '创建分类' })
  @UseInterceptors(FileInterceptor('img'))
  async create(
    @Body() body: CreateCategoryDto,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { name } = body;
    let imageUrl = 'no_url';
    if (file) {
      imageUrl = await this.toolsService.uploadFile(file, 'category');
    }
    console.log('url ', file);

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: 'Name is required.' });
    }

    await this.categoryService.create({ ...body, image: imageUrl });

    res.json({
      success: true,
      message: 'Category created successfully.',
      data: null,
    });
  }

  @Put('/:id')
  @ApiOperation({ summary: '编辑分类' })
  @UseInterceptors(FileInterceptor('img'))
  async update(
    @Param('id') id: string,
    @Body() body: CreateCategoryDto,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { name } = body;
    let image = body.image;

    if (file) {
      image = await this.toolsService.uploadFile(file, 'category');
    }

    if (!name || !image) {
      return res
        .status(400)
        .json({ success: false, message: 'Name and image are required.' });
    }

    const updatedCategory = await this.categoryService.update(id, {
      ...body,
      image: image,
    });
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: 'Category not found.' });
    }

    res.json({
      success: true,
      message: 'Category updated successfully.',
      data: null,
    });
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除分类' })
  async remove(@Param('id') id: string) {
    await this.categoryService.delete(id);
    return { success: true, message: 'Category deleted successfully.' };
  }
}
