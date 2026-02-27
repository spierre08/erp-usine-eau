import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vente } from './model/vente.model';
import { ClientService } from 'src/client/client.service';
import { Util } from 'src/common/utils/utils';
import { VenteDto } from './dto/vente.dto';
import { PanierVenteService } from 'src/panier-vente/panier-vente.service';
import { ArticleService } from 'src/article/article.service';
import { StatutEnum } from './enum/statut-vente.enum';
import { ReferenceService } from 'src/reference/reference.service';
import dayjs from 'dayjs';
import { MouvementStockService } from 'src/mouvement-stock/mouvement-stock.service';
import { TypeMouvementStock } from 'src/mouvement-stock/enum/type-mouvement.dto';

@Injectable()
export class VenteService {
  constructor(
    @InjectModel(Vente.name) private readonly venteModel: Model<Vente>,
    private readonly clientService: ClientService,
    private readonly panierService: PanierVenteService,
    private readonly articleService: ArticleService,
    private readonly referenceService: ReferenceService,
    private readonly mouvementStock: MouvementStockService,
  ) {}

  async create(data: VenteDto) {
    const start = dayjs().startOf('day').toDate();
    const end = dayjs().endOf('day').toDate();

    const countToday = await this.venteModel.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    const reference = this.referenceService.generate('FAC', countToday);

    const client = await this.clientService.getById(data.client_id);
    if (!client) {
      throw new NotFoundException("Ce client n'existe pas !");
    }

    const vente = await this.venteModel.create({
      client_id: data.client_id,
      statut_vente: data.statut_vente ?? StatutEnum.EN_ATTENTE,
      date_vente: new Date(),
      ref_vente: reference,
    });

    const panierCreations: Array<{
      vente_id: Types.ObjectId;
      article_id: Types.ObjectId;
      quantite: number;
      prix_unitaire: number;
    }> = [];
    const mouvementCreation: Array<{
      article_id: Types.ObjectId;
      quantite: number;
      type_mouvement: TypeMouvementStock.ENTRE;
    }> = [];

    for (const item of data.cardData) {
      const article = await this.articleService.findOne(item.article_id);

      if (!article) {
        throw new NotFoundException(
          `L'article avec l'id ${item.article_id} n'existe pas`,
        );
      }

      if (article.stock_actuel < item.quantite) {
        throw new BadRequestException(
          `Stock insuffisant pour l'article ${article.nom_article}. Les autres articles ont été ajoutés dans le panier (total ${panierCreations.length})`,
        );
      }

      article.stock_actuel -= item.quantite;
      await article.save();

      panierCreations.push({
        vente_id: new Types.ObjectId(vente._id),
        article_id: new Types.ObjectId(item.article_id),
        quantite: item.quantite,
        prix_unitaire: article.prix_unitaire,
      });

      mouvementCreation.push({
        article_id: new Types.ObjectId(item.article_id),
        quantite: item.quantite,
        type_mouvement: TypeMouvementStock.ENTRE,
      });
    }

    await this.panierService.createMany(panierCreations);
    await this.mouvementStock.createMany(mouvementCreation);

    return {
      saleData: {
        ...vente.toObject(),
      },
      cartData: data.cardData,
    };
  }

  getById = async (id: string) => {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide");
    }

    const response = await this.venteModel
      .findById(id)
      .populate('_id', 'nom tel adresse');

    if (!response) {
      throw new NotFoundException("Cette vente n'existe pas !");
    }

    return response;
  };

  async getAll(filter: Record<string, any>) {
    const {
      client_id,
      ref_vente,
      startDate,
      endDate,
      statut_vente,
      page = 1,
      limit = 40,
    } = filter;
    let query: Record<string, any> = {};
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 40;
    const skip = (pageNumber - 1) * limitNumber;

    if (client_id) {
      if (!Util.ObjectId.isValid(client_id)) {
        throw new BadRequestException("L'id du client est invalide");
      }

      query.client_id = client_id;
    }

    if (ref_vente) {
      query.ref_vente = ref_vente;
    }

    if (statut_vente) {
      query.statut_vente = statut_vente;
    }

    if (startDate && endDate) {
      if (startDate > endDate) {
        throw new BadRequestException(
          'La date début ne doit pas être supérieure à la date de fin',
        );
      }

      let start = new Date(new Date(startDate).setHours(0, 0, 0, 0));
      let end = new Date(new Date(endDate).setHours(23, 59, 59, 999));
      query['createdAt'] = {
        $gte: start,
        $lte: end,
      };
    } else {
      let todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      let todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      query['createdAt'] = {
        $gte: todayStart,
        $lte: todayEnd,
      };
    }

    const response = await this.venteModel
      .find(query)
      .populate('client_id', 'nom tel adresse')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);
    const mappedResponse = await Promise.all(
      response.map(async (item: any) => {
        const montantTotal = await this.panierService.totalSall(item._id);
        return {
          ...(item.toObject?.() ?? item),
          montantTotal: parseInt(montantTotal),
        };
      }),
    );
    const total = await this.venteModel.countDocuments(query);

    return {
      data: mappedResponse,
      page: pageNumber,
      limit: limitNumber,
      total,
    };
  }

  async getTotalVentesRealiseesMois() {
    const now = new Date();

    const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
    debutMois.setHours(0, 0, 0, 0);

    const finMois = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    finMois.setHours(23, 59, 59, 999);

    const total = await this.venteModel.countDocuments({
      date_vente: { $gte: debutMois, $lte: finMois },
      statut_vente: { $in: ['PAYE', 'LIVREE'] },
    });

    return {
      mois: now.getMonth() + 1,
      annee: now.getFullYear(),
      totalVentesRealisees: total,
    };
  }

  async update(id: string, data: any) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide");
    }

    const response = await this.venteModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!response) {
      throw new NotFoundException("Cette vente n'existe pas !");
    }

    return response;
  }

  async updateStatus(id: string, statut_vente: StatutEnum) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide");
    }

    const statusArrayValid: string[] = [
      'EN_ATTENTE',
      'PAYE_PARTIEL',
      'PAYE',
      'LIVREE',
      'ANNULEE',
    ];

    if (!statusArrayValid.includes(statut_vente)) {
      throw new BadRequestException('Le statut de la vente est invalide');
    }

    const vente = await this.venteModel.findById(id);

    if (!vente) {
      throw new NotFoundException(
        "Cette vente n'existe pas ou a déjà été supprimée !",
      );
    }

    vente.statut_vente = statut_vente;
    vente.save();

    return vente;
  }

  async delete(id: string) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide");
    }

    const vente = await this.venteModel.findById(id);
    if (!vente) {
      throw new NotFoundException(
        "Cette vente n'existe pas ou a déjà été supprimée !",
      );
    }

    await this.venteModel.findByIdAndDelete(id);

    const response = await this.panierService.deleteBySalleId(id);

    return {
      message: 'Cette vente a été supprimée avec succès !',
      deletedPaniers: response.deletedCount || 0,
    };
  }
}
