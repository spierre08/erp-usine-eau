import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { StockUpDto } from './dto/stock-up.dto';
import { StockDownDto } from './dto/stock-up.dto down';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createArticleDto: CreateProductDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get('total-article')
  getNombreArticles() {
    return this.articleService.getNombreArticles();
  }

  @Roles(Role.ADMIN, Role.COMPTABLE)
  @Get()
  findAll(@Query() filter: any) {
    return this.articleService.findAll(filter);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateProductDto) {
    return this.articleService.update(id, updateArticleDto);
  }

  @Roles(Role.ADMIN)
  @Patch('stock-up/:id')
  stockUp(@Param('id') id: string, @Body() updateArticleDto: StockUpDto) {
    return this.articleService.stockUp(id, updateArticleDto);
  }

  @Roles(Role.ADMIN)
  @Patch('stock-down/:id')
  stockDown(@Param('id') id: string, @Body() updateArticleDto: StockDownDto) {
    return this.articleService.stockDown(id, updateArticleDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }
}
