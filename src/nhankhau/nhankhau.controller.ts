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
import { HasRoles } from 'src/auth/has-roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { DondinhChinhNhanKhauDto } from 'src/dto/donDinhChinhNhanKhau.dto';
import { GiayKhaiTuDto } from 'src/dto/giayKhaiTu.dto';
import { nhanKhauDto } from 'src/dto/nhanKhau.dto';
import { Role } from 'src/model/role.enum';
import { ThongKeNhanKhauDto } from '../thongke/dto/thongKeNhanKhau.dto';
import { ThemNhanKhauDto } from './dto/themNhanKhau.dto';
import { NhankhauService } from './nhankhau.service';

@UseGuards(AuthGuard('jwt'),RolesGuard)
@Controller('nhankhau')
export class NhankhauController {
  constructor( private readonly nhanKhauService: NhankhauService) {}
  @Post()
  khaiSinh(@Body() body: ThemNhanKhauDto) {
    const {nhanKhauInfo, ...restBody } = body
    return this.nhanKhauService.themNhanKhau(nhanKhauInfo, restBody)
  }
  @Get()
  async searchNhanKhau(@Req() req: Request) {
    const {limit, page, ...searchParams} =req.query
    const data = await this.nhanKhauService.searchNhanKhau({limit: +limit , page: +page, condition: searchParams})
    return {data, total: data.length}
  }
  @Delete(':id')
  khaiTu(@Param('id') id: number, @Body() body: GiayKhaiTuDto) {
    return this.nhanKhauService.xoaNhanKhau(id, body)
  }
  @Post('dinh-chinh')
  dinhChinhNhanKhau(@Body() body: Array<DondinhChinhNhanKhauDto>) {
    return this.nhanKhauService.dinhChinh(...body)
  }
  @HasRoles(Role.Admin)
  @Patch('dinh-chinh/:id')
  acceptDinhChinh(@Param('id') id: number) {
    return this.nhanKhauService.acceptDinhChinh(id)
  }
  @Get(':id')
  thongTinNhanKhau(@Param('id') id: number) {
    return this.nhanKhauService.searchNhanKhau({condition: {id}})
  }
  @Get('thongke')
  thongKeNhanKhau(@Query() query: ThongKeNhanKhauDto) {
    return { nhankhau: [], totalNhanKhau: 5 };
  }
}
