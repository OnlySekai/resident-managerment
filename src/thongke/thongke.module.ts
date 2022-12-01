import { Module } from '@nestjs/common';
import { ThongkeController } from './thongke.controller';

@Module({
  controllers: [ThongkeController]
})
export class ThongkeModule {}
