import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Personnel } from './model/personnel.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePersonnelDto } from './dto/personnel.dto';
import { Util } from 'src/common/utils/utils';

@Injectable()
export class PersonnelService {
  constructor(
    @InjectModel(Personnel.name) private personnelModel: Model<Personnel>,
  ) {}

  private async isPhoneExists(phone: string) {
    const personnel = await this.personnelModel.findOne({ tel: phone });
    return !!personnel;
  }

  async create(data: CreatePersonnelDto) {
    const isPhoneExists = await this.isPhoneExists(data.tel);
    if (isPhoneExists) {
      throw new ConflictException('Le numéro de téléphone existe déjà');
    }
    const response = await this.personnelModel.create(data);

    return response;
  }

  async getById(id: string) {
    if (!Util.ObjectId.isValid(id)) {
      throw new Error("L'id est invalide !");
    }

    const response = await this.personnelModel.findById(id);

    if (!response) {
      throw new NotFoundException('Ce personnel est introuvable !');
    }

    return response;
  }

  async getAll(filter: any) {
    const {
      nom,
      prenom,
      tel,
      sexe,
      adresse,
      role,
      page = 1,
      limit = 40,
    } = filter;
    let query: Record<string, any> = {};

    if (nom) {
      query.nom = RegExp(nom, 'i');
    }
    if (prenom) {
      query.prenom = RegExp(prenom, 'i');
    }
    if (tel) {
      query.tel = tel;
    }
    if (adresse) {
      query.adresse = adresse;
    }
    if (role) {
      query.role = role;
    }

    if (sexe) {
      query.sexe = sexe;
    }

    const count = await this.personnelModel.countDocuments(query);
    const pageNumber: number = parseInt(page) || 1;
    const limitNumber: number = parseInt(limit) || 40;
    const skip = (pageNumber - 1) * limitNumber;
    const response = await this.personnelModel
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
  }

  async update(id: string, data: Partial<CreatePersonnelDto>) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide !");
    }

    const response = await this.personnelModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!response) {
      throw new NotFoundException("Ce personnel n'existe pas !");
    }

    return response;
  }

  async delete(id: string) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide !");
    }

    const response = await this.personnelModel.findByIdAndDelete(id);

    if (!response) {
      throw new NotFoundException(
        "Ce personnel n'existe pas ou a déjà été supprimé !",
      );
    }

    return {
      message: 'Ce personnel a été supprimé avec succès !',
    };
  }
}
