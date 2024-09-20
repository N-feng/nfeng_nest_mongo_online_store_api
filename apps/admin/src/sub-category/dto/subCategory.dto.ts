import { IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubCategoryDto {
  @ApiPropertyOptional({ description: 'Name' })
  @IsNotEmpty({ message: 'Name and category ID are required.' })
  name: string;

  @ApiPropertyOptional({ description: 'category ID' })
  @IsNotEmpty({ message: 'Name and category ID are required.' })
  categoryId: string;
}
