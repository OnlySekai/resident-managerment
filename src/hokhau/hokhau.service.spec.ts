import { Test, TestingModule } from '@nestjs/testing';
import { HokhauService } from './hokhau.service';

describe('HokhauService', () => {
  let service: HokhauService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HokhauService],
    }).compile();

    service = module.get<HokhauService>(HokhauService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
