import { Test, TestingModule } from '@nestjs/testing';
import { ThietbiController } from './thietbi.controller';
import { ThietbiService } from './thietbi.service';

describe('ThietbiController', () => {
  let controller: ThietbiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThietbiController],
      providers: [ThietbiService],
    }).compile();

    controller = module.get<ThietbiController>(ThietbiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
