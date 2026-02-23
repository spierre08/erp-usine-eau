import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MouvementStock } from './model/mouvement-stock.model';
import { Model } from 'mongoose';
import dayjs from 'dayjs';
import { ReferenceService } from 'src/reference/reference.service';
import { Util } from 'src/common/utils/utils';

@Injectable()
export class MouvementStockService {
  constructor(
    @InjectModel(MouvementStock.name)
    private readonly mouvementModel: Model<MouvementStock>,
    private readonly referenceService: ReferenceService,
  ) {}

  async create(data: any) {
    const start = dayjs().startOf('day').toDate();
    const end = dayjs().endOf('day').toDate();
    const countToday = await this.mouvementModel.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });
    const reference = this.referenceService.generate('MVT-SK', countToday);

    const response = await this.mouvementModel.create({
      ...data,
      reference,
    });

    return response;
  }

  async createMany(dataArray: any[]) {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      throw new BadRequestException('Aucun mouvement à créer');
    }

    const start = dayjs().startOf('day').toDate();
    const end = dayjs().endOf('day').toDate();

    const countToday = await this.mouvementModel.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    const mouvementsToInsert = dataArray.map((data, index) => ({
      ...data,
      reference: this.referenceService.generate('MVT-SK', countToday + index),
    }));

    const response = await this.mouvementModel.insertMany(mouvementsToInsert);

    return response;
  }

  async findAll(filter: Record<string, any>) {
    const { startDate, article_id, endDate, page = 1, limit = 40 } = filter;
    const query: Record<string, any> = {};

    if (article_id) {
      if (!Util.ObjectId.isValid(article_id)) {
        throw new BadRequestException("L'id de l'article est invalide");
      }

      query.article_id = new Util.ObjectId(article_id);
    }

    if (startDate && endDate) {
      if (startDate > endDate) {
        throw new BadRequestException(
          'La date début ne doit pas être supérieure à la date de fin',
        );
      }

      let start = new Date(new Date(startDate).setHours(0, 0, 0, 0));
      let end = new Date(new Date(endDate).setHours(23, 59, 59, 999));
      query.createdAt = {
        $gte: start,
        $lte: end,
      };
    } else {
      let todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      let todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: todayStart,
        $lte: todayEnd,
      };
    }

    const total = await this.mouvementModel.countDocuments(query);
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 40;
    const skip = (pageNumber - 1) * limitNumber;
    const data = await this.mouvementModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    return {
      data,
      total,
      page: pageNumber,
      limit: limitNumber,
    };
  }
}
