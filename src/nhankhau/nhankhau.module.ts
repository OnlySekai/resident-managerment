import { Module } from '@nestjs/common';
import { NhankhauController } from './nhankhau.controller';
import { NhankhauService } from './nhankhau.service';
@Module({
  controllers: [NhankhauController],
  providers: [NhankhauService],
})
export class NhankhauModule {}
