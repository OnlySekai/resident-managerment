import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/model/role.enum';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor( private readonly usersService: UserService) {}

  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('accept/:id')
  pheDuyet(@Req() req: Request) {
    return this.usersService.acceptUser( +req.params.id)
  }
  
  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('new')
  taoUser(@Body() body) {
    return this.usersService.createUser(body.username, body.password)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUser(@Req() req: Request) {
    return this.usersService.getUserByUsename(req.user['username'])
  }
}
