import { Test, TestingModule } from '@nestjs/testing';
import { TamvangController } from './tamvang.controller';

describe('TamvangController', () => {
  let controller: TamvangController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TamvangController],
    }).compile();

    controller = module.get<TamvangController>(TamvangController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
