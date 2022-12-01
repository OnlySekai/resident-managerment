import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DonTamTruDto } from 'src/dto/donTamTru.dto';
import { TamtruService } from './tamtru.service';

@Controller('tamtru')
export class TamtruController {
  constructor(private readonly tamTruService: TamtruService) {}
  @Post()
  themTamTru(@Body() body) {
    const { nhanKhau, donTamTru } = body;
    return this.tamTruService.themTamTru(nhanKhau, donTamTru).then(() => {
      message: 'them thanh cong';
    });
  }
  @Patch('id')
  suaTamTru(@Param('id') id: number, @Body() body: DonTamTruDto) {
    return { message: 'Sửa tạm trú thành công' };
  }
  @Get('id')
  chiTietTamTru(@Param('id') id: number) {
    return { tamtru: {} };
  }
  @Delete('id')
  xoaTamTru(@Param('id') id: number) {
    return { message: 'Xoá tạm trú thành công' };
  }
}
