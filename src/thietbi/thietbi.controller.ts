import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ThietbiService } from './thietbi.service';
import { CreateThietbiDto } from './dto/create-thietbi.dto';
import { UpdateThietbiDto } from './dto/update-thietbi.dto';

@Controller('thietbi')
export class ThietbiController {
  constructor(private readonly thietbiService: ThietbiService) {}

  @Post()
  create(@Body() createThietbiDto: CreateThietbiDto) {
    return this.thietbiService.createThietbi(createThietbiDto);
  }

  @Get()
  findAll() {
    return this.thietbiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thietbiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateThietbiDto: UpdateThietbiDto) {
    return this.thietbiService.update(+id, updateThietbiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thietbiService.remove(+id);
  }
}
