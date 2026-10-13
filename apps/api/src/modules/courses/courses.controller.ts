import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @Public() @Get() findAll() { return this.service.findAll(); }
  @Public() @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Post() create(@Body() data: any) { return this.service.create(data); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() data: any) { return this.service.update(id, data); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}