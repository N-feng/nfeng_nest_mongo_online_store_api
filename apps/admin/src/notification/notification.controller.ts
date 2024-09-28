import { ToolsService } from '@app/tools';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import * as OneSignal from 'onesignal-node';

const client = new OneSignal.Client(
  process.env.ONE_SIGNAL_APP_ID,
  process.env.ONE_SIGNAL_REST_API_KEY,
);

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly toolsService: ToolsService,
  ) {}

  @Post('/send-notification')
  @ApiOperation({ summary: '发送消息' })
  async create(@Body() body, @Res() res: Response) {
    const { title, description, imageUrl } = body;

    const notificationBody = {
      contents: {
        en: description,
      },
      headings: {
        en: title,
      },
      included_segments: ['Subscribed Users'],
      // included_segments: ['All'],
      ...(imageUrl && { big_picture: imageUrl }),
    };

    const response = await client.createNotification(notificationBody);
    console.log('response: ', response);
    const notificationId = response.body.id;
    console.log('Notification sent to all users:', notificationId);
    await this.notificationService.create({
      notificationId,
      title,
      description,
      imageUrl,
    });
    res.json({
      success: true,
      message: 'Notification sent successfully',
      data: null,
    });
  }

  @Get('/track-notification/:id')
  @ApiOperation({ summary: '查询用户消息' })
  async orderByUserId(@Param('id') id: string) {
    const notificationId = id;

    const response = await client.viewNotification(notificationId);
    const androidStats = response.body.platform_delivery_stats;

    const result = {
      platform: 'Android',
      success_delivery: androidStats.android.successful,
      failed_delivery: androidStats.android.failed,
      errored_delivery: androidStats.android.errored,
      opened_notification: androidStats.android.converted,
    };
    console.log('Notification details:', androidStats);
    return { success: true, message: 'success', data: result };
  }

  @Get('/all-notification')
  @ApiOperation({ summary: '消息列表' })
  async findAll() {
    const result = await this.notificationService.findAll();
    return {
      success: true,
      message: 'Notifications retrieved successfully.',
      data: result,
    };
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除消息' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const deletedNotification = await this.notificationService.delete(id);
    if (!deletedNotification) {
      return res
        .status(404)
        .json({ success: false, message: 'Notification not found.' });
    }
    res.json({ success: true, message: 'Notification deleted successfully.' });
  }
}
