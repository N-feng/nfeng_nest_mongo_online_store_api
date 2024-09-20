import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { DbModule } from '@app/db';
import { ConfigModule } from '@nestjs/config';
import { ToolsService } from '@app/tools';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
  ],
  providers: [CommonService, ToolsService],
  exports: [CommonService, ToolsService],
})
export class CommonModule {}
