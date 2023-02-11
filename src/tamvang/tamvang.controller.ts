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
import { UserPayloadDto } from 'src/auth/dto/userPayload.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { DonTamVangDto } from 'src/dto/donTamVang.dto';
import { TamvangService } from './tamvang.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('tamvang')
export class TamvangController {
  constructor(private readonly tamVangService: TamvangService) {}

  @Post()
  async themTamVang(@Body() body: DonTamVangDto) {
    return this.tamVangService.themTamVang(body);
  }

  @Delete(':id')
  rejectTamVang(@Req() req, @Param('id') id: number) {
    const user = req.user as UserPayloadDto;
    return this.tamVangService.rejectTamVang(user, id);
  }

  @Post(':id')
  acceptTamVang(@Param('id') id, @Req() req) {
    return this.tamVangService.acceptTamVang(id, req.user.userId);
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
