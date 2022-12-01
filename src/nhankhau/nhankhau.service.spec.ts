import { Test, TestingModule } from '@nestjs/testing';
import { NhankhauService } from './nhankhau.service';

describe('NhankhauService', () => {
  let service: NhankhauService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NhankhauService],
    }).compile();

    service = module.get<NhankhauService>(NhankhauService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
