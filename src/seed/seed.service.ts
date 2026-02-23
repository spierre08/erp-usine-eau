import { Injectable, OnModuleInit } from '@nestjs/common';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { UtilisateurRole } from 'src/utilisateur/enum/utilisateur-role.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Utilisateur } from 'src/utilisateur/model/utilisateur.model';
import { Model } from 'mongoose';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(Utilisateur.name)
    private readonly utilisateurModel: Model<Utilisateur>,
    private readonly dotenv: ConfigService,
  ) {}

  async onModuleInit() {
    const adminUsername = this.dotenv.get<string>('ADMIN') as string;

    const utilisateur = await this.utilisateurModel.findOne({
      nom_utilisateur: adminUsername,
    });

    if (!utilisateur) {
      await this.utilisateurModel.create({
        nom_utilisateur: adminUsername,
        password: await argon2.hash(
          this.dotenv.get<string>('ADMIN_PASSWORD') as string,
        ),
        role: UtilisateurRole.ADMIN,
      });

      console.log('✅ ADMIN créé automatiquement');
    }
  }
}