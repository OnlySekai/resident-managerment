import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DondinhChinhNhanKhauDto } from 'src/dto/donDinhChinhNhanKhau.dto';
import { nhanKhauDto } from 'src/dto/nhanKhau.dto';
import { ThongKeNhanKhauDto } from '../thongke/dto/thongKeNhanKhau.dto';

@Controller('nhankhau')
export class NhankhauController {
  @Post()
  themNhanKhau(@Body() body: nhanKhauDto) {
    return { message: 'Thêm nhân khẩu thành công' };
  }
  @Get()
  searchNhanKhau(@Query() query: nhanKhauDto) {
    return { nhankhau: [], totalNhanKhau: 5 };
  }
  @Delete(':id')
  deleteNhanKhau(@Param('id') id: number) {
    return { message: 'Xoá nhân khẩu thành công' };
  }
  @Patch('id')
  editNhankhau(@Param('id') id: number, @Body() body: DondinhChinhNhanKhauDto) {
    return { message: 'Sửa nhân khẩu thành công' };
  }
  @Get('id')
  thongTinNhanKhau(@Param('id') id: number) {
    return {};
  }
  @Get('thongke')
  thongKeNhanKhau(@Query() query: ThongKeNhanKhauDto) {
    return { nhankhau: [], totalNhanKhau: 5 };
  }
}
