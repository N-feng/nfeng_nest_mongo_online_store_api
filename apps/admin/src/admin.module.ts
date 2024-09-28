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
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { PosterService } from './poster/poster.service';
import { PosterController } from './poster/poster.controller';
import { CouponCodeService } from './coupon-code/coupon-code.service';
import { CouponCodeController } from './coupon-code/coupon-code.controller';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { PaymentController } from './payment/payment.controller';
import { NotificationService } from './notification/notification.service';
import { NotificationController } from './notification/notification.controller';

@Module({
  imports: [CommonModule],
  controllers: [
    CategoryController,
    SubCategoryController,
    BrandController,
    VariantTypeController,
    VariantController,
    ProductController,
    PosterController,
    CouponCodeController,
    UserController,
    OrderController,
    PaymentController,
    NotificationController,
  ],
  providers: [
    CategoryService,
    SubCategoryService,
    BrandService,
    VariantTypeService,
    VariantService,
    ProductService,
    PosterService,
    CouponCodeService,
    UserService,
    OrderService,
    NotificationService,
  ],
})
export class AdminModule {}
