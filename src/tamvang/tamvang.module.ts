import { Module } from '@nestjs/common';
import { TamvangController } from './tamvang.controller';
import { TamvangService } from './tamvang.service';

@Module({
  controllers: [TamvangController],
  providers: [TamvangService],
})
export class TamvangModule {}
