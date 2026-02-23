import {
  Controller,
  Body,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Patch,
} from '@nestjs/common';
import { PersonnelService } from './personnel.service';
import { CreatePersonnelDto } from './dto/personnel.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enum/role.enum';

@Controller('personnels')
export class PersonnelController {
  constructor(private readonly personnelService: PersonnelService) {}

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() data: CreatePersonnelDto) {
    return this.personnelService.create(data);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.personnelService.getById(id);
  }

  @Roles(Role.ADMIN)
  @Get()
  async getAll(@Query() filter: any) {
    return this.personnelService.getAll(filter);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<CreatePersonnelDto>,
  ) {
    return this.personnelService.update(id, data);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.personnelService.delete(id);
  }
}
