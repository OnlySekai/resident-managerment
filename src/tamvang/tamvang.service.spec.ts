import { Test, TestingModule } from '@nestjs/testing';
import { TamvangService } from './tamvang.service';

describe('TamvangService', () => {
  let service: TamvangService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TamvangService],
    }).compile();

    service = module.get<TamvangService>(TamvangService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
