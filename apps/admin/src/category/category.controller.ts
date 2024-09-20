import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
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

  @Post('/')
  @ApiOperation({ summary: '创建分类' })
  @UseInterceptors(FileInterceptor('img'))
  async create(
    @Body() body: CreateCategoryDto,
    @UploadedFile() img: Express.Multer.File,
  ) {
    if (img) {
      const source = img.buffer;
      console.log('source: ', source);
      const filename = this.toolsService.getCosUploadFile(
        img.originalname,
        'category',
      );
      console.log('filename: ', filename);
    }
    await this.categoryService.create(body);
    return { code: 200, data: {} };
  }

  @Put('/:id')
  @ApiOperation({ summary: '编辑分类' })
  @UseInterceptors(FileInterceptor('img'))
  async update(
    @Param('id') id: string,
    @Body() body: CreateCategoryDto,
    @UploadedFile() img: Express.Multer.File,
  ) {
    if (img) {
      const source = img.buffer;
      const filename = this.toolsService.getCosUploadFile(
        img.originalname,
        'category',
      );

      //异步 改成 同步
      await this.toolsService.uploadCos(filename, source);

      const image = process.env.cosUrl + '/' + filename;
      await this.categoryService.update(id, { ...body, image: image });
      return {
        success: true,
        message: 'Category updated successfully.',
        data: null,
      };
    }

    return {
      success: true,
      message: 'Error updating category: no img',
      data: null,
    };
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除分类' })
  async remove(@Param('id') id: string) {
    await this.categoryService.delete(id);
    return { success: true, message: 'Category deleted successfully.' };
  }
}
