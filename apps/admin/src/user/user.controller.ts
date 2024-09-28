import { ToolsService } from '@app/tools';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly toolsService: ToolsService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: '用户列表' })
  async findAll() {
    const result = await this.userService.findAll();
    return {
      success: true,
      message: 'User retrieved successfully.',
      data: result,
    };
  }

  // login
  @Post('/login')
  @ApiOperation({ summary: '用户登陆' })
  async findOne(@Body() body, @Res() res: Response) {
    const { name, password } = body;

    // Check if the user exists
    const user = await this.userService.findOne({ name });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid name or password.' });
    }
    // Check if the password is correct
    if (user.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid name or password.' });
    }

    // Authentication successful
    res
      .status(200)
      .json({ success: true, message: 'Login successful.', data: user });
  }

  // Create a new user
  @Post('/register')
  @ApiOperation({ summary: '注册用户' })
  async create(@Body() body, @Res() res: Response) {
    const { name, password } = body;
    if (!name || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Name, and password are required.' });
    }
    await this.userService.create({ name, password });
    res.json({
      success: true,
      message: 'User created successfully.',
      data: null,
    });
  }

  @Put('/:id')
  @ApiOperation({ summary: '编辑用户' })
  @UseInterceptors(FileInterceptor('img'))
  async update(
    @Param('id') id: string,
    @Body() body,
    @UploadedFile() img: Express.Multer.File,
  ) {
    if (img) {
      const image = await this.toolsService.uploadFile(img, 'poster');
      await this.userService.update(id, { ...body, image: image });
      return {
        success: true,
        message: 'User updated successfully.',
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
  @ApiOperation({ summary: '删除用户' })
  async remove(@Param('id') id: string) {
    await this.userService.delete(id);
    return { success: true, message: 'User deleted successfully.' };
  }
}
