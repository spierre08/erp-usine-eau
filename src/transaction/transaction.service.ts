import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './model/transaction.model';
import { Model } from 'mongoose';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { Util } from 'src/common/utils/utils';
import { ReferenceService } from 'src/reference/reference.service';
import { TypeDepenseEnum } from './enum/type.enum';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
    private readonly utilisateurService: UtilisateurService,
    private readonly referenceService: ReferenceService
  ){}
  async create(data: any) {
    if (!Util.ObjectId.isValid(data.user_id)) {
      throw new BadRequestException('L\'id de l utilisateur est invalide')
    }

    const utilisateur = await this.utilisateurService.getById(data.user_id)

    if (!utilisateur){
      throw new NotFoundException("Cet utilisateur est introuvable !")
    }

    const ref_transaction = this.referenceService.generateTransactionReference('TRX')

    return await this.transactionModel.create({
      ...data,
      ref_transaction,
    })
  }

  async findAll(filter: Record<string, any>) {
    const { startDate, endDate, categorie_transaction, type_transaction, user_id, page = 1, limit = 40 } = filter
    let query: Record<string, any> = {}
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 40;
    const skip = (pageNumber - 1) * limitNumber;
    
    if (categorie_transaction){
      query.categorie_transaction = categorie_transaction
    }

    if (type_transaction){
      query.type_transaction = type_transaction
    }

    if (user_id){
      if (!Util.ObjectId.isValid(user_id)){
        throw new BadRequestException('L\'id de l utilisateur est invalide')
      }

      query.user_id = user_id
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

    const response = await this.transactionModel.find(query)
    .populate({
      path: 'user_id',
      select: 'nom_utilisateur',
      populate: {
        path: 'personnel_id',
        select: 'nom prenom'
      }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)

    return {
      data: response,
      page: pageNumber,
      limit: limitNumber,
      total: await this.transactionModel.countDocuments(query)
    }
  }

  async kpi(filter: Record<string, any>){
     const { startDate, endDate, user_id } = filter
    let query: Record<string, any> = {}

    if (user_id){
      if (!Util.ObjectId.isValid(user_id)){
        throw new BadRequestException('L\'id de l utilisateur est invalide')
      }

      query.user_id = user_id
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

  const totalSortieAgg = await this.transactionModel.aggregate([
      { $match: { ...query, type_transaction: TypeDepenseEnum.SORTIE } },
      { $group: { _id: null, total: { $sum: '$montant' } } },
    ]);
    const totalEntreeAgg = await this.transactionModel.aggregate([
      { $match: { ...query, type_transaction: TypeDepenseEnum.ENTRE } },
      { $group: { _id: null, total: { $sum: '$montant' } } },
    ]);
    const totalTransactionAgg = await this.transactionModel.aggregate([
      { $match: { ...query } },
      { $group: { _id: null, total: { $sum: '$montant' } } },
    ]);

    const totalSortie = totalSortieAgg[0]?.total || 0;
    const totalEntree = totalEntreeAgg[0]?.total || 0;
    const totalTransaction = totalTransactionAgg[0]?.total || 0;

    return {
      totalTransaction,
      totalEntree,
      totalSortie,
    };
  }

  async findOne(id: string) {
    if (!Util.ObjectId.isValid(id)){
      throw new BadRequestException('L\'id de la transaction est invalide')
    }

    const response = await this.transactionModel.findById(id)
    .populate({
      path: 'user_id',
      select: 'nom_utilisateur',
      populate: {
        path: 'personnel_id',
        select: 'nom prenom'
      }
    })

    if (!response){
      throw new NotFoundException("Cette transaction n'existe pas !")
    }

    return response
  }

  async update(id: string, data: any) {
    if (!Util.ObjectId.isValid(id)){
      throw new BadRequestException('L\'id de la transaction est invalide')
    }

    const response = await this.transactionModel.findByIdAndUpdate(id, data, { new: true })

    if (!response){
      throw new NotFoundException("Cette transaction n'existe pas !")
    }

    return response
  }

  async remove(id: string) {
    if (!Util.ObjectId.isValid(id)){
      throw new BadRequestException('L\'id de la transaction est invalide')
    }
    
    const response = await this.transactionModel.findById(id)

    if (!response){
      throw new NotFoundException("Cette transaction n'existe pas ou a déjà été supprimée !")
    }

    await this.transactionModel.findByIdAndDelete(id)

    return {
      message: "Cette transaction a été supprimée avec succès !",
    }
  }
}
