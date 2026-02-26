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
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enum/role.enum';

@Controller('utilisateurs')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() data: CreateUtilisateurDto) {
    return this.utilisateurService.create(data);
  }

  @Roles(Role.ADMIN)
  @Get()
  async getAll(@Query() filter: any) {
    return this.utilisateurService.getAll(filter);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.utilisateurService.getById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.utilisateurService.update(id, data);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async updatePassword(@Param('id') id: string, @Body() data: UpdatePasswordDto) {
    return this.utilisateurService.updatePassword(id, data.password);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.utilisateurService.delete(id);
  }
}
