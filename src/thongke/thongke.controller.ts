import { Controller, Get, Param, Query } from '@nestjs/common';
import { ThongKeNhanKhauDto } from 'src/thongke/dto/thongKeNhanKhau.dto';

@Controller('thongke')
export class ThongkeController {
  @Get('nhankhau')
  thongKeNhanKhau(@Query() query: ThongKeNhanKhauDto) {
    return {};
  }
  @Get('hokhau')
  thongKeHokhau(@Query() query) {
    return {};
  }
}
