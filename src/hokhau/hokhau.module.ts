import { Module } from '@nestjs/common';
import { HokhauController } from './hokhau.controller';
import { HokhauService } from './hokhau.service';

@Module({
  controllers: [HokhauController],
  providers: [HokhauService],
})
export class HokhauModule {}
