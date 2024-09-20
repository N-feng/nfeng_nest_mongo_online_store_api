import { IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiPropertyOptional({ description: '分类名称' })
  @IsNotEmpty({ message: '请填写分类名称' })
  name: string;

  @ApiPropertyOptional({ description: '分类图片' })
  @IsNotEmpty({ message: '请上传分类图片' })
  image: string;
}
