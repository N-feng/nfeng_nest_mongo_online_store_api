import { Test, TestingModule } from '@nestjs/testing';
import { CouponCodeService } from './coupon-code.service';

describe('CouponCodeService', () => {
  let service: CouponCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouponCodeService],
    }).compile();

    service = module.get<CouponCodeService>(CouponCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
