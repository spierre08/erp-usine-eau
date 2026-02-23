import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductionService } from './production.service';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { ProductionDto } from './dto/production.dto';

@Controller('productions')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() data: ProductionDto) {
    return this.productionService.create(data);
  }

  @Roles(Role.ADMIN)
  @Get()
  getAll(@Query() filter: any) {
    return this.productionService.getAll(filter);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.productionService.getById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: ProductionDto) {
    return this.productionService.update(id, data);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productionService.delete(id);
  }
}
