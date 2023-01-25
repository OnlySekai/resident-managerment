import { Body, Controller, Get } from '@nestjs/common';
import { SearchHistoryDto } from './dto/searchHistory.dto';

@Controller('history')
export class HistoryController {
  @Get('hokhau')
  suaHoKhau(@Body() body: SearchHistoryDto) {
    return { hokhau: [], totalHokhau: 5 };
  }
  @Get('nhankhau')
  suaNhanKhau(@Body() body: SearchHistoryDto) {
    return { nhankhau: [], totalHokhau: 5 };
  }
}
