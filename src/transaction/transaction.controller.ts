import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enum/role.enum';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Roles(Role.ADMIN, Role.COMPTABLE)
  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionService.create(createTransactionDto);
  }

  @Roles(Role.ADMIN, Role.COMPTABLE)
  @Get()
  async findAll(@Query() filter: Record<string, any>) {
    return await this.transactionService.findAll(filter);
  }

  @Roles(Role.ADMIN, Role.COMPTABLE)
  @Get('kpi')
  async kpi(@Query() filter: Record<string, any>) {
    return await this.transactionService.kpi(filter);
  }

  @Roles(Role.ADMIN, Role.COMPTABLE)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.transactionService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return await this.transactionService.update(id, updateTransactionDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.transactionService.remove(id);
  }
}
