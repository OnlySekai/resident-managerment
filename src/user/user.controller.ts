import {
  Body,
  Controller,
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
import { userDto } from 'src/dto/user.dto';
import { Role } from 'src/model/role.enum';
import { selfUpdateUserDto } from './dto/selfUpdateUser.dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @HasRoles(Role.Admin)
  @Get('all')
  getAllUser(@Req() req) {
    return this.usersService.getAllUser();
  }

  @HasRoles(Role.Admin)
  @Patch('accept/:id')
  pheDuyet(@Req() req: Request) {
    return this.usersService.acceptUser(+req.params.id);
  }

  @HasRoles(Role.Admin)
  @Post('new')
  taoUser(@Req() req, @Body() body: selfUpdateUserDto) {
    const user = req.user as UserPayloadDto;
    return this.usersService.createUser(user, body);
  }

  @Patch('update')
  updateUser(@Req() req, @Body() body: selfUpdateUserDto) {
    const user = req.user as UserPayloadDto;
    return this.usersService.updateUser(req.user, body);
  }

  @Get('user/:username')
  getUser(@Param('username') username: string) {
    return this.usersService.getUserByUsename(username);
  }

  @Get('search')
  searchUser(@Query() query) {
    return this.searchUser(query);
  }
}
