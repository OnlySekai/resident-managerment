import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserPayloadDto } from 'src/auth/dto/userPayload.dto';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { DondinhChinhNhanKhauDto } from 'src/dto/donDinhChinhNhanKhau.dto';
import { GiayKhaiTuDto } from 'src/dto/giayKhaiTu.dto';
import { Role } from 'src/model/role.enum';
import { ThongKeNhanKhauDto } from '../thongke/dto/thongKeNhanKhau.dto';
import { searchKhaiSinh } from './dto/searchKhaiSinh.dto';
import { searchKhaiTuDto } from './dto/searchKhaiTu.dto';
import { ThemNhanKhauDto } from './dto/themNhanKhau.dto';
import { NhankhauService } from './nhankhau.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('nhankhau')
export class NhankhauController {
  constructor(private readonly nhanKhauService: NhankhauService) {}
  @Get('khai-tu')
  getKhaiTu(@Query() query: searchKhaiTuDto) {
    return this.nhanKhauService.searKhaiTu(query);
  }
  @Get('khai-sinh')
  getKhaiSinh(@Query() query: searchKhaiSinh) {
    return this.nhanKhauService.searchKhaiSinh(query);
  }
  @Post()
  khaiSinh(@Body() body: ThemNhanKhauDto) {
    const { nhanKhauInfo, ...restBody } = body;
    return this.nhanKhauService.themNhanKhau(nhanKhauInfo, restBody);
  }
  @Get()
  async searchNhanKhau(@Req() req: Request) {
    const { limit, page, ...searchParams } = req.query;
    return Promise.all(
      this.nhanKhauService.searchNhanKhau({
        limit: +limit,
        page: +page,
        condition: searchParams,
      }),
    ).then((rs) => {
      const [data, [total]] = rs;
      return {
        data,
        total: total['count(`id`)'],
      };
    });
  }
  @Delete(':id')
  khaiTu(@Param('id') id: number, @Body() body: GiayKhaiTuDto) {
    return this.nhanKhauService.xoaNhanKhau(id, body);
  }

  @Patch('dinh-chinh')
  dinhChinhNhanKhau(@Body() body: DondinhChinhNhanKhauDto) {
    return this.nhanKhauService.dinhChinh(body);
  }

  @HasRoles(Role.Admin)
  @Patch('dinh-chinh/:id')
  acceptDinhChinh(@Param('id') id: number, @Req() req) {
    return this.nhanKhauService.acceptDinhChinh(id, req.user.useId);
  }

  @Patch('dinh-chinh/tu-choi/:id')
  rejectDinhChinh(@Req() req, @Param('id') id: number) {
    const user = req.user as UserPayloadDto;
    return this.nhanKhauService.rejectDinhChinh(user, id);
  }

  @Get(':id')
  thongTinNhanKhau(@Param('id') id: number) {
    return this.nhanKhauService.searchNhanKhau({ condition: { id } });
  }
}
