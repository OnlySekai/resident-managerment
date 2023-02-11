import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserPayloadDto } from 'src/auth/dto/userPayload.dto';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { queryGetDonDto } from 'src/common/queryGetDon.dto';
import { DatabaseService } from 'src/database.service';
import { DonChuyenKhauDto } from 'src/dto/donChuyenKhau.dto';
import { DonDinhChinhHoKhauDto } from 'src/dto/donDinhChinhHoKhau.dto';
import { DonTachKhauCungDto } from 'src/dto/donTachKhauCung.dto';
import { HokhauDto } from 'src/dto/hoKhau.dto';
import { Role } from 'src/model/role.enum';
import { InputChuyenKhauDto } from './dto/inputChuyenKhau.dto';
import { InnputDonNhapKhauDto } from './dto/inputNhapKhau.dto';
import { InputTachKhauDto } from './dto/inputTachKhau.dto';
import { SearchHoKhauDto } from './dto/searchHokhau.dto';
import { HokhauService } from './hokhau.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('hokhau')
export class HokhauController {
  constructor(private readonly hoKhauService: HokhauService) {}
  //TODO: Nhap khau

  @Post('new')
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

  @Get(':id')
  getHoKhau(@Param('id') id: number) {
    return id;
  }

  @Patch()
  suaKhau(@Body() body: DonDinhChinhHoKhauDto) {
    return this.hoKhauService.suaKhau(body);
  }

  @HasRoles(Role.Admin)
  @Patch(':id')
  acceptSuaKhau(@Param('id') id: number, @Req() req) {
    return this.hoKhauService.acceptSuaKhau(id, req.user.userId);
  }

  @HasRoles(Role.Admin)
  @Patch('sua-khau/tu-choi/:id')
  rejectSuaKhau(@Req() req, @Param('id') id: number) {
    const user = req.user as UserPayloadDto;
    return this.hoKhauService.rejectSuakhau(user, id);
  }

  @HasRoles(Role.Admin)
  @Get('don/:id')
  getDonsuaKhau(@Query() query: queryGetDonDto, @Param('id') id: any) {
    if (id == 'all') return this.hoKhauService.getDon(query);
  }

  @Delete('chuyen-khau/tu-choi/:id')
  rejectChuyenKhau(@Req() req, @Param('id') id: number) {
    const user = req.user as UserPayloadDto;
    return this.hoKhauService.rejectChuyenKhau(user, id);
  }
  @HasRoles(Role.Admin)
  @Delete()
  async chuyenHoKhau(@Body() body: InputChuyenKhauDto) {
    return this.hoKhauService.chuyenKhau(body);
  }

  @HasRoles(Role.Admin)
  @Delete(':id')
  async acceptChuyenKhau(@Param('id') id: number, @Req() req) {
    console.log(id);
    return this.hoKhauService.acceptChuyenKhau(id, req.user.userId);
  }

  @Post('tach-khau/tu-choi/:id')
  rejectTachKhau(@Req() req, @Param('id') id: number) {
    return this.hoKhauService.rejectTachKhau(req.user, id);
  }
  @Put()
  tachKhau(@Body() body: InputTachKhauDto) {
    return this.hoKhauService.tachKhau(body);
  }

  @HasRoles(Role.Admin)
  @Put(':id')
  acceptTachKhau(@Param('id') id: number, @Req() req) {
    return this.hoKhauService.acceptTachKhau(id, req.user.userId);
  }

  @Get('test')
  test() {
    const database = new DatabaseService();
    return database
      .so_ho_khau_table()
      .insert({ chu_ho_id: 2, dia_chi: 'test' });
  }

  @Post('nhap-khau/tu-choi/:id')
  rejectNhapKhau(@Req() req, @Param('id') id: number) {
    return this.hoKhauService.rejectNhapKhau(req.user, id);
  }
  @Post()
  nhapKhau(@Body() inputNhapKhau: InnputDonNhapKhauDto) {
    return this.hoKhauService.nhapKhau(inputNhapKhau);
  }

  @Post(':id')
  accpetNhapKhau(@Param('id') id: number, @Req() req) {
    return this.hoKhauService.acceptNhapKhau(id, req.user.userId);
  }
}
