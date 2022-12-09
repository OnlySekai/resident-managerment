import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { DonTamVangDto } from 'src/dto/donTamVang.dto';
import { TamvangService } from './tamvang.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('tamvang')
export class TamvangController {
  constructor(private readonly tamVangService: TamvangService) {}
  @Post()
  async themTamVang(@Body() body: DonTamVangDto) {
    await this.tamVangService.themTamVang(body);
    return { message: 'Tạm vắng thành công' };
  }
  @Post(':id')
  acceptTamVang(@Param('id') id, @Req() req) {
    this.tamVangService.acceptTamVang(id, req.user.userId)
  }
  @Get('id')
  chiTietTamVang(@Param('id') id: number) {
    return { donTamVang: {} };
  }
  @Delete('id')
  xoaTamVang(@Param('id') id: number) {
    return {};
  }
  @Patch('id')
  suaTamVang(@Param('id') id: number) {
    return {};
  }
}
