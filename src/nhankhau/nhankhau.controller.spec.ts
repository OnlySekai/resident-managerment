import { Test, TestingModule } from '@nestjs/testing';
import { NhankhauController } from './nhankhau.controller';

describe('NhankhauController', () => {
  let controller: NhankhauController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NhankhauController],
    }).compile();

    controller = module.get<NhankhauController>(NhankhauController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
