import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePanierVenteDto } from './dto/update-panier-vente.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PanierVente } from './model/panier-vente.model';
import { Model, Types } from 'mongoose';
import { Util } from 'src/common/utils/utils';
import { ArticleService } from 'src/article/article.service';

@Injectable()
export class PanierVenteService {
  constructor(
    @InjectModel(PanierVente.name)
    private readonly panierModel: Model<PanierVente>,
    private readonly articleServicle: ArticleService,
  ) {}

  async create(data: any) {
    return await this.panierModel.create(data);
  }

  async createMany(data: any) {
    return await this.panierModel.insertMany(data);
  }

  async totalSall(vente_id: string) {
    if (!Util.ObjectId.isValid(vente_id)) {
      throw new BadRequestException("L'id de la vente est invalide");
    }
    const result = await this.panierModel.aggregate([
      {
        $match: {
          vente_id: new Types.ObjectId(vente_id),
        },
      },
      {
        $group: {
          _id: '$vente_id',
          totalAmount: {
            $sum: {
              $multiply: ['$quantite', '$prix_unitaire'],
            },
          },
        },
      },
    ]);

    return result[0]?.totalAmount ?? 0;
  }

  async findAll(vente_id: string) {
    if (!Util.ObjectId.isValid(vente_id)) {
      throw new BadRequestException("L'id de la vente est invalide");
    }

    const response = await this.panierModel
      .find({ vente_id: new Types.ObjectId(vente_id) })
      .populate('article_id', '_id code_lot nom_article prix_unitaire');

    return response;
  }

  async findOne(id: string) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide");
    }

    const response = await this.panierModel
      .findById(id)
      .populate('vente_id')
      .populate('article_id', 'code_lot nom_article prix_unitaire unite');

    if (!response) {
      throw new NotFoundException("Cette ligne de vente n'existe pas !");
    }

    return response;
  }

  async update(id: string, updatePanierVenteDto: UpdatePanierVenteDto) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide");
    }

    const response = await this.panierModel.findByIdAndUpdate(
      id,
      updatePanierVenteDto,
      { new: true },
    );

    if (!response) {
      throw new NotFoundException("Cette ligne de vente n'existe pas !");
    }

    return response;
  }

  async remove(id: string) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide");
    }

    const response = await this.panierModel.findById(id);

    if (!response) {
      throw new NotFoundException(
        "Cette ligne de vente n'existe pas ou a déjà été supprimée !",
      );
    }

    await this.panierModel.findByIdAndDelete(id);

    return {
      message: 'Cette ligne de vente a été supprimé avec succès !',
    };
  }

  async deleteBySalleId(vente_id: string | Types.ObjectId) {
    if (!Types.ObjectId.isValid(vente_id)) {
      throw new BadRequestException("L'id de la vente est invalide");
    }

    const response = await this.panierModel.deleteMany({
      vente_id: new Types.ObjectId(vente_id),
    });

    return response;
  }
}
