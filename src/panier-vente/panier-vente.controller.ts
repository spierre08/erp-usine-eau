import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { PanierVenteService } from './panier-vente.service';
import { UpdatePanierVenteDto } from './dto/update-panier-vente.dto';

@Controller('panier-ventes')
export class PanierVenteController {
  constructor(private readonly panierVenteService: PanierVenteService) {}

  @Get('by-vente/:vente_id')
  findAll(@Param('vente_id') vente_id: string) {
    return this.panierVenteService.findAll(vente_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.panierVenteService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePanierVenteDto: UpdatePanierVenteDto,
  ) {
    return this.panierVenteService.update(id, updatePanierVenteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.panierVenteService.remove(id);
  }
}
