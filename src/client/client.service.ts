import {
  Injectable,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './model/client.model';
import { CreateClientDto } from './dto/create-client.dto';
import { Util } from 'src/common/utils/utils';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
  ) { }

  private async isPhoneExists(tel: string) {
    const response = await this.clientModel.findOne({ tel });

    return !!response;
  }

  async create(data: CreateClientDto) {
    try {
      const isPhoneExists = await this.isPhoneExists(data.tel);

      if (isPhoneExists) {
        throw new ConflictException('Le numéro de téléphone existe déjà');
      }

      return await this.clientModel.create(data);
    } catch (error: any) {
      throw new InternalServerErrorException(
        error?.message || 'Erreur interne du serveur',
      );
    }
  }

  async getKpi() {
    try {
      const response = await this.clientModel.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ['$estActif', true] }, 1, 0] } },
            inactive: { $sum: { $cond: [{ $eq: ['$estActif', false] }, 1, 0] } },
          },
        },
      ]);

      return response[0] || { total: 0, active: 0, inactive: 0 };
    } catch (error: any) {
      throw new InternalServerErrorException(
        error?.message || 'Erreur interne du serveur',
      );
    }
  }

  async getById(id: string) {
    try {
      if (!Util.ObjectId.isValid(id)) {
        throw new BadRequestException("L'id est invalide !");
      }
      const response = await this.clientModel.findById(id);

      if (!response) {
        throw new NotFoundException('Client non trouvé');
      }

      return response;
    } catch (error: any) {
      throw new InternalServerErrorException(
        error?.message || 'Erreur interne du serveur',
      );
    }
  }

  async getAll(filter: Record<string, any>) {
    try {
      const { nom, tel, adresse, page = 1, limit = 40 } = filter;
      let query: Record<string, any> = {};

      if (nom) {
        query.nom = RegExp(nom, 'i');
      }
      if (tel) {
        query.tel = tel;
      }
      if (adresse) {
        query.adresse = adresse;
      }

      const count = await this.clientModel.countDocuments(query);
      const pageNumber: number = parseInt(page) || 1;
      const limitNumber: number = parseInt(limit) || 40;
      const skip = (pageNumber - 1) * limitNumber;
      const response = await this.clientModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean();

      return {
        data: response,
        total: count,
        page: pageNumber,
        limit: limitNumber,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        error?.message || 'Erreur interne du serveur',
      );
    }
  }

  async disable(id: string) {
    try {
      if (!Util.ObjectId.isValid(id)) {
        throw new BadRequestException("L'id est invalide !");
      }

      const response = await this.clientModel.findByIdAndUpdate(id, { estActif: false }, {
        new: true,
      });

      if (!response) {
        throw new NotFoundException("Ce client n'existe pas !");
      }

      return {
        message: "Ce client a été rendu inactif avec succès !"
      }
    } catch (error: any) {
      throw new InternalServerErrorException(
        error?.message || 'Erreur interne du serveur',
      );
    }
  }

  async update(id: string, data: Partial<CreateClientDto>) {
    try {
      if (!Util.ObjectId.isValid(id)) {
        throw new BadRequestException("L'id est invalide !");
      }

      const response = await this.clientModel.findByIdAndUpdate(id, data, {
        new: true,
      });

      if (!response) {
        throw new NotFoundException("Ce client n'existe pas !");
      }

      return response;
    } catch (error: any) {
      throw new InternalServerErrorException(
        error?.message || 'Erreur interne du serveur',
      );
    }
  }

  async delete(id: string) {
    try {
      if (!Util.ObjectId.isValid(id)) {
        throw new BadRequestException("L'id est invalide !");
      }

      const response = await this.clientModel.findByIdAndDelete(id);

      if (!response) {
        throw new NotFoundException(
          "Ce client n'existe pas ou a déjà été supprimé !",
        );
      }

      return {
        message: 'Ce client a été supprimé avec succès !',
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        error?.message || 'Erreur interne du serveur',
      );
    }
  }
}
