import { Test, TestingModule } from '@nestjs/testing';
import { TamtruController } from './tamtru.controller';

describe('TamtruController', () => {
  let controller: TamtruController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TamtruController],
    }).compile();

    controller = module.get<TamtruController>(TamtruController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
