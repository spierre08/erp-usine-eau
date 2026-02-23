import {
  Controller,
  Post,
  Get,
  Query,
  Param,
  Delete,
  Body,
  Patch,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Role } from 'src/auth/enum/role.enum';
import { Roles } from 'src/auth/decorator/role.decorator';
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Roles(Role.ADMIN, Role.COMPTABLE)
  @Post()
  async create(@Body() data: CreateClientDto) {
    return this.clientService.create(data);
  }

  @Roles(Role.ADMIN, Role.COMPTABLE)
  @Get()
  async getAll(@Query() filter: any) {
    return this.clientService.getAll(filter);
  }

  @Roles(Role.ADMIN, Role.COMPTABLE)
  @Get('kpi')
  async getKpi() {
    return this.clientService.getKpi();
  }

  @Roles(Role.ADMIN, Role.COMPTABLE)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.clientService.getById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/disable')
  async disable(@Param('id') id: string) {
    return this.clientService.disable(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<CreateClientDto>,
  ) {
    return this.clientService.update(id, data);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.clientService.delete(id);
  }
}
