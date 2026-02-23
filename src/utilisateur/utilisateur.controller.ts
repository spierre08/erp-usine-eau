import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Query,
  Body,
  Param,
} from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';

@Controller('utilisateurs')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}

  @Post()
  async create(@Body() data: CreateUtilisateurDto) {
    return this.utilisateurService.create(data);
  }

  @Get()
  async getAll(@Query() filter: any) {
    return this.utilisateurService.getAll(filter);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.utilisateurService.getById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.utilisateurService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.utilisateurService.delete(id);
  }
}
