import { Module } from '@nestjs/common';
import { ThietbiService } from './thietbi.service';
import { ThietbiController } from './thietbi.controller';

@Module({
  controllers: [ThietbiController],
  providers: [ThietbiService]
})
export class ThietbiModule {}
