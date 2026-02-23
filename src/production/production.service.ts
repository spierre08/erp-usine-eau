import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Production } from './model/production.model';
import { Model } from 'mongoose';
import { Util } from 'src/common/utils/utils';
import { ProductionDto } from './dto/production.dto';
import { ReferenceService } from 'src/reference/reference.service';
import dayjs from 'dayjs';

@Injectable()
export class ProductionService {
  constructor(
    @InjectModel(Production.name)
    private readonly productionModel: Model<Production>,
    private readonly referenceService: ReferenceService,
  ) {}

  async create(data: ProductionDto) {
    const start = dayjs().startOf('day').toDate();
    const end = dayjs().endOf('day').toDate();
    const countToday = await this.productionModel.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });
    const reference = this.referenceService.generate('PRD', countToday);
    const response = await this.productionModel.create({
      ...data,
      code_lot: reference,
    });

    return response;
  }

  async getById(id: string) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide");
    }

    const response = await this.productionModel.findById(id);

    if (!response) {
      throw new NotFoundException("Cette production n'existe pas !");
    }

    return response;
  }

  async getAll(filter: any) {
    const { startDate, endDate } = filter;
    let query: Record<string, any> = {};

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

    const responses = await this.productionModel
      .find(query)
      .sort({ createdAt: -1 })
      .lean();

    return responses;
  }

  async update(id: string, data: ProductionDto) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide");
    }

    const response = await this.productionModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!response) {
      throw new NotFoundException("Cette production n'existe pas !");
    }

    return response;
  }

  async delete(id: string) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide");
    }

    const response = await this.productionModel.findByIdAndDelete(id);

    if (!response) {
      throw new NotFoundException(
        "Cette production n'existe pas ou a déjà été supprimée !",
      );
    }

    return {
      message: 'Cette production a été supprimée avec succès !',
    };
  }
}
