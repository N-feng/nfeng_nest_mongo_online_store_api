import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { SubCategory, SubCategorySchema } from './schemas/subCategory.schema';
import { Brand, BrandSchema } from './schemas/brand.schema';
import { Variant, VariantSchema } from './schemas/variant.schema';
import { VariantType, VariantTypeSchema } from './schemas/variantType.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { Poster, PosterSchema } from './schemas/poster.schema';
import { Coupon, CouponSchema } from './schemas/couponCode';

const models = MongooseModule.forFeature([
  { name: Category.name, schema: CategorySchema, collection: 'category' },
  {
    name: SubCategory.name,
    schema: SubCategorySchema,
    collection: 'subcategories',
  },
  {
    name: Brand.name,
    schema: BrandSchema,
    collection: 'brands',
  },
  {
    name: Variant.name,
    schema: VariantSchema,
    collection: 'variants',
  },
  {
    name: VariantType.name,
    schema: VariantTypeSchema,
    collection: 'varianttypes',
  },
  {
    name: Product.name,
    schema: ProductSchema,
    collection: 'products',
  },
  {
    name: Poster.name,
    schema: PosterSchema,
    collection: 'posters',
  },
  {
    name: Coupon.name,
    schema: CouponSchema,
    collection: 'coupons',
  },
]);

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.DB,
        useUnifiedTopology: true,
      }),
    }),
    models,
  ],
  providers: [DbService],
  exports: [DbService, models],
})
export class DbModule {}
