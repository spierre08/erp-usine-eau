import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Delete,
  Patch,
} from '@nestjs/common';
import { VenteService } from './vente.service';
import { VenteDto } from './dto/vente.dto';
import { StatutEnum } from './enum/statut-vente.enum';

@Controller('ventes')
export class VenteController {
  constructor(private readonly venteService: VenteService) { }

  @Post()
  async create(@Body() data: VenteDto) {
    return await this.venteService.create(data);
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    return await this.venteService.getById(id)
  }

  @Get()
  async getAll(@Query() filter: any) {
    return await this.venteService.getAll(filter)
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() data: any) {
    return await this.venteService.update(id, data)
  }

  @Patch("status/:id")
  async updateStatus(@Param("id") id: string, data: { statut_vente: StatutEnum }) {
    return await this.venteService.updateStatus(id, data.statut_vente);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.venteService.delete(id)
  }
}
