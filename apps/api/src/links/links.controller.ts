import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LinksService } from './links.service';

import { ApiOkResponse } from '@nestjs/swagger';
import { CreateLinkDto } from '@repo/api/links/dto/create-link.dto';
import { UpdateLinkDto } from '@repo/api/links/dto/update-link.dto';
import { Link } from '@repo/api/links/entities/link.entity';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  create(@Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(createLinkDto);
  }

  @Get()
  @ApiOkResponse({ type: [Link] })
  findAll() {
    return this.linksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.linksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(+id, updateLinkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linksService.remove(+id);
  }
}
