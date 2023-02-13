import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ThietbiService } from './thietbi.service';
import { CreateThietbiDto } from './dto/create-thietbi.dto';
import { UpdateThietbiDto } from './dto/update-thietbi.dto';
import { CreateThietbiTypeDto } from './dto/create-thietbi-type.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/model/role.enum';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { query } from 'express';
import { MuonDto } from './dto/muon.dto';
import { TraDto } from './dto/tra.dto';
import { CreatePhieuMuonDto } from './dto/create-phieuMuon.dto';
import { TrackBackQuest } from 'src/common/interface';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('tai-nguyen')
export class ThietbiController {
  constructor(private readonly thietbiService: ThietbiService) {}

  @Post()
  createTaiNguyen(@Body() createThietbi: CreateThietbiDto, @Req() req) {
    return this.thietbiService.createThietbi(createThietbi, req.user.roles);
  }

  @Get()
  getTaiNguyen(@Query() query) {
    return this.thietbiService.getTaiNguyen(query);
  }

  @HasRoles(Role.Admin)
  @Post('type')
  createType(@Body() createThietBiType: CreateThietbiTypeDto) {
    return this.thietbiService.createTaiNguyenType(createThietBiType);
  }

  @Get('type')
  getTaiNguyenType(@Query() query) {
    return this.thietbiService.getTaiNguyenType(query);
  }

  @Post('muon')
  muonThietBi(@Body() phieumuon: MuonDto, @Req() req) {
    return this.thietbiService.muonThietBi(phieumuon, req.user.userId);
  }

  @Get('muon')
  async getPhieuMuon(@Query() query) {
    return Promise.all(await this.thietbiService.getPhieuMuon(query));
  }

  @Post('tra')
  traThietBi(@Body() phieuTra: TraDto) {
    return this.thietbiService.traThietBi(phieuTra);
  }

  @Get('kha-dung')
  timThietBiKhaDung(@Query() query) {
    return this.thietbiService.findAllTaiNguyenKhaDung(query);
  }

  @Get('track-back/:id')
  trackBack(@Param('id') id: number, @Query() query: TrackBackQuest) {
    return this.thietbiService.trackBackThietBi(id, query);
  }
  @Get('sao-ke')
  getSaoKe(@Query() query) {
    const { id } = query;
    return this.thietbiService.getSaoKe(id);
  }
}
