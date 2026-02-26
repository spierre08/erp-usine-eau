import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from './model/article.model';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Util } from 'src/common/utils/utils';
import { StockUpDto } from './dto/stock-up.dto';
import { MouvementStockService } from 'src/mouvement-stock/mouvement-stock.service';
import { TypeMouvementStock } from 'src/mouvement-stock/enum/type-mouvement.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
    private readonly mouvementService: MouvementStockService,
  ) {}

  async create(createArticleDto: CreateProductDto) {
    const { nom_article } = createArticleDto;
    const isNameExists = await this.articleModel.findOne({
      nom_article: { $regex: `.*${nom_article}.*` },
    });

    if (isNameExists) {
      throw new ConflictException(
        'Cet article existe déjà veuillez saisir autre !',
      );
    }

    const response = await this.articleModel.create(createArticleDto);

    await this.mouvementService.create({
      article_id: response._id,
      quantite: createArticleDto.stock_actuel,
      type_mouvement: TypeMouvementStock.ENTRE,
    });

    return response;
  }

  async getNombreArticles() {
    return this.articleModel.countDocuments();
  }

  async findAll(filter: any) {
    const { page = 1, limit = 40, nom_article } = filter;
    const query: Record<string, any> = {};
    let result: Record<string, any> = [];

    if (nom_article) {
      query.nom_article = { $regex: nom_article, $options: 'i' };
    }

    const count = await this.articleModel.countDocuments(query);
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 40;
    const skip = (pageNumber - 1) * limitNumber;

    const data = await this.articleModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    for (const item of data) {
      let stateStock: string = 'En Stock';
      if (item.stock_actuel <= 10) {
        stateStock = 'Seuil Critique';
      }

      result.push({ ...item.toObject(), etat_stock: stateStock });
    }

    return {
      data: result,
      total: count,
      page: pageNumber,
      limit: limitNumber,
    };
  }

  async findOne(id: string) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide !");
    }

    const article = await this.articleModel.findById(id);

    if (!article) {
      throw new NotFoundException('Article introuvable');
    }

    return article;
  }

  async update(id: string, updateArticleDto: UpdateProductDto) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide !");
    }

    const updatedArticle = await this.articleModel.findByIdAndUpdate(
      id,
      updateArticleDto,
      { new: true },
    );

    if (!updatedArticle) {
      throw new NotFoundException('Article introuvable');
    }

    return updatedArticle;
  }

  async stockUp(id: string, data: StockUpDto) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide !");
    }

    const response = await this.articleModel.findById(id);

    if (!response) {
      throw new NotFoundException("Cet article n'eexiste pas !");
    }

    response.stock_actuel += data.quantity;
    response.save();

    await this.mouvementService.create({
      article_id: response._id,
      quantite: data.quantity,
      type_mouvement: TypeMouvementStock.ENTRE,
    });

    return response;
  }

  async remove(id: string) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide !");
    }

    const deletedArticle = await this.articleModel.findByIdAndDelete(id);

    if (!deletedArticle) {
      throw new NotFoundException('Article introuvable');
    }

    return { message: 'Article supprimé avec succès' };
  }
}
