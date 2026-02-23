import { Controller, Get, Query } from '@nestjs/common';
import { MouvementStockService } from './mouvement-stock.service';

@Controller('mouvement-stocks')
export class MouvementStockController {
  constructor(private readonly mouvementStockService: MouvementStockService) {}

  @Get()
  async findAll(@Query() filter: Record<string, any>) {
    return await this.mouvementStockService.findAll(filter);
  }
}
