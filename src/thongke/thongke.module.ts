import { Module } from '@nestjs/common';
import { ThongkeController } from './thongke.controller';
import { ThongKeService } from './thongKe.service';

@Module({
  controllers: [ThongkeController],
  providers: [ThongKeService]
})
export class ThongkeModule {}
