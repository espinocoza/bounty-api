import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PiratesService } from '../pirates/services/pirates.service';
import { CreatePirateDto } from '../pirates/dtos/create-pirate.dto';
import { UpdatePirateDto } from '../pirates/dtos/update-pirate.dto';

@Controller('pirates')
export class PiratesController {
  constructor(private readonly piratesService: PiratesService) {}

  @Post()
  create(@Body() createPirateDto: CreatePirateDto) {
    return this.piratesService.create(createPirateDto);
  }

  @Get()
  findAll() {
    return this.piratesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.piratesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePirateDto: UpdatePirateDto,
  ) {
    return this.piratesService.update(id, updatePirateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.piratesService.remove(id);
  }
}
