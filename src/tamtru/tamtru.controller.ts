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
import { DonTamTruDto } from 'src/dto/donTamTru.dto';
import { TamtruService } from './tamtru.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
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

  @Post(':id')
  acceptTamTru(@Param('id') id: number, @Req() req) {
    return this.tamTruService.acceptTamTru(id, req.user.userId)
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
