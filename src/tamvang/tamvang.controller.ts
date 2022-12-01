import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DonTamVangDto } from 'src/dto/donTamVang.dto';
import { TamvangService } from './tamvang.service';

@Controller('tamvang')
export class TamvangController {
  constructor(private readonly tamVangService: TamvangService) {}
  @Post()
  async themTamVang(@Body() body: DonTamVangDto) {
    await this.tamVangService.themTamVang(body);
    return { message: 'Tạm vắng thành công' };
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
