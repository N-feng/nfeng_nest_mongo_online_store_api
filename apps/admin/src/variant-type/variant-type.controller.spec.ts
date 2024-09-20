import { Test, TestingModule } from '@nestjs/testing';
import { VariantTypeController } from './variant-type.controller';

describe('VariantTypeController', () => {
  let controller: VariantTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariantTypeController],
    }).compile();

    controller = module.get<VariantTypeController>(VariantTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
