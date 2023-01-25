import { Module } from '@nestjs/common';
import { TamtruController } from './tamtru.controller';
import { TamtruService } from './tamtru.service';

@Module({
  controllers: [TamtruController],
  providers: [TamtruService],
})
export class TamtruModule {}
