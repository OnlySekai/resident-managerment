import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { DatabaseService } from 'src/database.service';
import { DonChuyenKhauDto } from 'src/dto/donChuyenKhau.dto';
import { DonDinhChinhHoKhauDto } from 'src/dto/donDinhChinhHoKhau.dto';
import { DonTachKhauCungDto } from 'src/dto/donTachKhauCung.dto';
import { HokhauDto } from 'src/dto/hoKhau.dto';
import { InputTachKhauDto } from './dto/inputTachKhau.dto';
import { SearchHoKhauDto } from './dto/searchHokhau.dto';
import { HokhauService } from './hokhau.service';

@Controller('hokhau')
export class HokhauController {
  constructor(private readonly hoKhauService: HokhauService) {}
  @Post()
  addHoKhau(@Body() body: HokhauDto) {
    return this.hoKhauService.themHoKhau(body).then((data) => {
      return { message: 'Thêm nhân khẩu thành công', data };
    });
  }
  @Get()
  async timHoKhau(@Req() req: Request) {
    const searchParamsDefault: SearchHoKhauDto = {
      tenChuHo: '',
      diaChi: '',
      cccd: '',
    };
    const searchParams = { ...searchParamsDefault, ...req.query };
    const hoKhaus = await this.hoKhauService.timHoKhau(searchParams);
    return { data: hoKhaus, total: hoKhaus.length };
  }
  @Delete(':id')
  async chuyenHoKhau(@Param('id') id: number, @Body() body: DonChuyenKhauDto) {
    await this.hoKhauService.chuyenKhau(id, body);
    return { message: 'Chuyen khau thanh cong' };
  }
  @Put()
  tachKhau(@Body() body: InputTachKhauDto) {
    return this.hoKhauService.tachKhau(body);
  }
  @Patch(':id')
  suaKhau(@Param('id') id: number, @Body() body: DonDinhChinhHoKhauDto) {
    return { message: 'Đính chính nhânh khẩu thành công' };
  }
  @Get('test')
  test() {
    const database = new DatabaseService();
    return database
      .so_ho_khau_table()
      .insert({ chu_ho_id: 2, dia_chi: 'test' });
  }
}
