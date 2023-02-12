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
import { HasRoles } from 'src/auth/has-roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { DonTamTruDto } from 'src/dto/donTamTru.dto';
import { Role } from 'src/model/role.enum';
import { TamtruService } from './tamtru.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('tamtru')
export class TamtruController {
  constructor(private readonly tamTruService: TamtruService) {}

  @Delete(':id')
  rejectTamTru(@Req() req, @Param('id') id: number) {
    const user = req.user as UserPayloadDto;
    return this.tamTruService.rejectTamTru(user, id);
  }

  @Post()
  themTamTru(@Body() body) {
    const { nhanKhau, donTamTru } = body;
    return this.tamTruService.themTamTru(nhanKhau, donTamTru).then(() => {
      message: 'them thanh cong';
    });
  }

  @HasRoles(Role.Admin)
  @Post(':id')
  acceptTamTru(@Param('id') id: number, @Req() req) {
    return this.tamTruService.acceptTamTru(id, req.user.userId);
  }

  @Patch('id')
  suaTamTru(@Param('id') id: number, @Body() body: DonTamTruDto) {
    return { message: 'Sửa tạm trú thành công' };
  }
}
