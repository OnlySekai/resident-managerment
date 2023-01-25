import { Test, TestingModule } from '@nestjs/testing';
import { ThietbiService } from './thietbi.service';

describe('ThietbiService', () => {
  let service: ThietbiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThietbiService],
    }).compile();

    service = module.get<ThietbiService>(ThietbiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
