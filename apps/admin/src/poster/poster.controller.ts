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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { PosterService } from './poster.service';

@Controller('posters')
export class PosterController {
  constructor(
    private readonly posterService: PosterService,
    private readonly toolsService: ToolsService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: '推送列表' })
  async findAll() {
    const result = await this.posterService.findAll();
    return {
      success: true,
      message: 'Poster retrieved successfully.',
      data: result,
    };
  }

  @Get('findOne')
  @ApiOperation({ summary: '查询推送' })
  async findOne(@Query('id') id: string) {
    const user = await this.posterService.findOne(id);
    return { code: 200, data: user };
  }

  @Post('/')
  @ApiOperation({ summary: '创建推送' })
  @UseInterceptors(FileInterceptor('img'))
  async create(
    @Body() body,
    @Res() res: Response,
    @UploadedFile() img: Express.Multer.File,
  ) {
    const { posterName } = body;
    let imageUrl = 'no_url';
    if (img) {
      imageUrl = await this.toolsService.uploadFile(img, 'poster');
    }
    await this.posterService.create({
      posterName: posterName,
      imageUrl: imageUrl,
    });
    res.json({
      success: true,
      message: 'Poster created successfully.',
      data: null,
    });
  }

  @Put('/:id')
  @ApiOperation({ summary: '编辑推送' })
  @UseInterceptors(FileInterceptor('img'))
  async update(
    @Param('id') id: string,
    @Body() body,
    @UploadedFile() img: Express.Multer.File,
  ) {
    if (img) {
      const image = await this.toolsService.uploadFile(img, 'poster');
      await this.posterService.update(id, { ...body, image: image });
      return {
        success: true,
        message: 'Poster updated successfully.',
        data: null,
      };
    }

    return {
      success: true,
      message: 'Error updating Poster: no img',
      data: null,
    };
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除推送' })
  async remove(@Param('id') id: string) {
    await this.posterService.delete(id);
    return { success: true, message: 'Poster deleted successfully.' };
  }
}
