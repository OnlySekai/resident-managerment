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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { DatabaseService } from 'src/database.service';
import { DonChuyenKhauDto } from 'src/dto/donChuyenKhau.dto';
import { DonDinhChinhHoKhauDto } from 'src/dto/donDinhChinhHoKhau.dto';
import { DonTachKhauCungDto } from 'src/dto/donTachKhauCung.dto';
import { HokhauDto } from 'src/dto/hoKhau.dto';
import { Role } from 'src/model/role.enum';
import { InputTachKhauDto } from './dto/inputTachKhau.dto';
import { SearchHoKhauDto } from './dto/searchHokhau.dto';
import { HokhauService } from './hokhau.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
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
  @Delete()
  async chuyenHoKhau(@Body() body: DonChuyenKhauDto) {
    await this.hoKhauService.chuyenKhau(body);
    return { message: 'Them don chuyen khau thanh cong' };
  }
  @HasRoles(Role.Admin)
  @Delete(':id')
  async acceptChuyenKhau(@Param('id') id: number) {
    console.log(id)
    return this.hoKhauService.acceptChuyenKhau(id)
  }
  @Put()
  tachKhau(@Body() body: InputTachKhauDto) {
    return this.hoKhauService.tachKhau(body);
  }
  
  @HasRoles(Role.Admin)
  @Put(':id')
  acceptTachKhau(@Param('id') id: number, @Req() req) {
    return this.hoKhauService.acceptTachKhau(id, req.user.userId)
  }
  @Patch()
  suaKhau( @Body() body: DonDinhChinhHoKhauDto) {
    return this.hoKhauService.suaKhau(body)
  }
  @Patch(':id')
  acceptSuaKhau(@Param('id') id: number, @Req() req) {
    return this.hoKhauService.acceptSuaKhau(id, req.user.userId)
  }
  @Get('test')
  test() {
    const database = new DatabaseService();
    return database
      .so_ho_khau_table()
      .insert({ chu_ho_id: 2, dia_chi: 'test' });
  }
}
