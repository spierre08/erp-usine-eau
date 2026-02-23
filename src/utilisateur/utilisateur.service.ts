import {
  ConflictException,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { Utilisateur } from './model/utilisateur.model';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { Util } from 'src/common/utils/utils';

@Injectable()
export class UtilisateurService {
  constructor(
    @InjectModel(Utilisateur.name) private utilisateurModel: Model<Utilisateur>,
  ) {}

  private async getByUserName(nom_utilisateur: string) {
    return this.utilisateurModel
      .findOne({
        nom_utilisateur: new RegExp(nom_utilisateur, 'i'),
      })
  }

  async getByUser(nom_utilisateur: string) {
    return this.utilisateurModel
      .findOne({
        nom_utilisateur,
      })
      .populate('personnel_id');
  }

  async create(data: any) {
      const utilisateur = await this.getByUserName(data.nom_utilisateur);
      if (utilisateur) {
        throw new ConflictException("Ce nom d'utilisateur est deja utilisé !");
      }

      const hash = await argon2.hash(data.password);
      const response = await this.utilisateurModel.create({
        nom_utilisateur: data.nom_utilisateur,
        password: hash,
        role: data.role,
        personnel_id: data.personnel_id,
      });
      return response;
  }

  async getById(id: string) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide !");
    }

    const response = await this.utilisateurModel
      .findById(id, { password: 0 })
      .populate('personnel_id');

    if (!response) {
      throw new NotFoundException("L'utilisateur est introuvable !");
    }

    return response;
  }

  async getAll(filter: any) {
    const {
      nom_utilisateur,
      role,
      personnel_id,
      statut,
      page = 1,
      limit = 40,
    } = filter;
    let query: Record<string, any> = {};

    if (nom_utilisateur) {
      query.nom_utilisateur = new RegExp(nom_utilisateur, 'i');
    }

    if (role) {
      query.role = role;
    }

    if (personnel_id) {
      query.personnel_id = personnel_id;
    }

    if (statut) {
      query.statut = statut;
    }

    const pageNumber: number = parseInt(page) || 1;
    const limitNumber: number = parseInt(limit) || 40;
    const skip = (pageNumber - 1) * limitNumber;
    const response = await this.utilisateurModel
      .find(query, { password: 0 })
      .populate('personnel_id')
      .skip(skip)
      .limit(limitNumber);
    const count = await this.utilisateurModel.countDocuments(query);

    return {
      data: response,
      page: pageNumber,
      limit: limitNumber,
      total: count,
    };
  }

  async update(id: string, data: any) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide !");
    }

    if (data?.nom_utilisateur) {
      const utilisateur = await this.getByUserName(data.nom_utilisateur);
      if (utilisateur) {
        throw new ConflictException("Ce nom d'utilisateur est deja utilisé !");
      }
    }

    const response = await this.utilisateurModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!response) {
      throw new NotFoundException("L'utilisateur est introuvable !");
    }

    return response;
  }

  async delete(id: string) {
    if (!Util.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id est invalide !");
    }

    const response = await this.utilisateurModel.findById(id);

    if (!response) {
      throw new NotFoundException(
        "L'utilisateur est introuvable ou a deja ete supprime !",
      );
    }

    await this.utilisateurModel.findByIdAndDelete(id);

    return {
      message: 'Cet utilisateur a ete supprime avec succes !',
    };
  }
}
