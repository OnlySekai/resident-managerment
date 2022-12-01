import { Test, TestingModule } from '@nestjs/testing';
import { ThongkeController } from './thongke.controller';

describe('ThongkeController', () => {
  let controller: ThongkeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThongkeController],
    }).compile();

    controller = module.get<ThongkeController>(ThongkeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
