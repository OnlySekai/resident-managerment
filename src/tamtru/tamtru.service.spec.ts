import { Test, TestingModule } from '@nestjs/testing';
import { TamtruService } from './tamtru.service';

describe('TamtruService', () => {
  let service: TamtruService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TamtruService],
    }).compile();

    service = module.get<TamtruService>(TamtruService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
