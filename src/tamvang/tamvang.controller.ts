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
import { DonTamVangDto } from 'src/dto/donTamVang.dto';
import { Role } from 'src/model/role.enum';
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

  @HasRoles(Role.Admin)
  @Post(':id')
  acceptTamVang(@Param('id') id, @Req() req) {
    return this.tamVangService.acceptTamVang(id, req.user.userId);
  }
}
