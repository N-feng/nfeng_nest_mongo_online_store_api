import { CommonModule } from '@app/common';
import { Module } from '@nestjs/common';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { SubCategoryController } from './sub-category/sub-category.controller';
import { SubCategoryService } from './sub-category/sub-category.service';
import { BrandController } from './brand/brand.controller';
import { BrandService } from './brand/brand.service';
import { VariantTypeService } from './variant-type/variant-type.service';
import { VariantTypeController } from './variant-type/variant-type.controller';
import { VariantService } from './variant/variant.service';
import { VariantController } from './variant/variant.controller';

@Module({
  imports: [CommonModule],
  controllers: [CategoryController, SubCategoryController, BrandController, VariantTypeController, VariantController],
  providers: [CategoryService, SubCategoryService, BrandService, VariantTypeService, VariantService],
})
export class AdminModule {}
