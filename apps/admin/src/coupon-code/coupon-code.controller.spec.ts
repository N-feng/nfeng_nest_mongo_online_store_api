import { Test, TestingModule } from '@nestjs/testing';
import { CouponCodeController } from './coupon-code.controller';

describe('CouponCodeController', () => {
  let controller: CouponCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponCodeController],
    }).compile();

    controller = module.get<CouponCodeController>(CouponCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
