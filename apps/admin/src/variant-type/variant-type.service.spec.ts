import { Test, TestingModule } from '@nestjs/testing';
import { VariantTypeService } from './variant-type.service';

describe('VariantTypeService', () => {
  let service: VariantTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VariantTypeService],
    }).compile();

    service = module.get<VariantTypeService>(VariantTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
