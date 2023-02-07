import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/model/role.enum';
import { UserService } from './user.service';

@HasRoles(Role.Admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Patch('accept/:id')
  pheDuyet(@Req() req: Request) {
    return this.usersService.acceptUser(+req.params.id);
  }

  @Post('new')
  taoUser(@Body() body) {
    return this.usersService.createUser(body.username, body.password);
  }

  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.usersService.getUserByUsename(username);
  }
}
