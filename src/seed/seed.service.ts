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
    private readonly configService: ConfigService,
  ) {}

  /**
   * Fonction utilitaire pour hasher un mot de passe
   */
  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  /**
   * Fonction pour créer un utilisateur si il n'existe pas
   */
  private async createUserIfNotExists(
    username: string,
    password: string,
    role: UtilisateurRole,
  ) {
    const existingUser = await this.utilisateurModel.findOne({ nom_utilisateur: username });

    if (!existingUser) {
      const hashedPassword = await this.hashPassword(password);
      await this.utilisateurModel.create({
        nom_utilisateur: username,
        password: hashedPassword,
        role,
      });
      console.log(`✅ Utilisateur '${username}' créé avec succès`);
    }
  }

  /**
   * Seed automatique au démarrage du module
   */
  async onModuleInit() {
    // Récupération des credentials depuis le .env
    const adminUsername = this.configService.get<string>('ADMIN') as string;
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD') as string;
    const adminUserUsername = this.configService.get<string>('ADMIN_USER') as string;
    const adminUserPassword = this.configService.get<string>('ADMIN_PASSWORD_USER') as string;

    // Création des utilisateurs si nécessaire
    await this.createUserIfNotExists(adminUsername, adminPassword, UtilisateurRole.ADMIN);
    await this.createUserIfNotExists(adminUserUsername, adminUserPassword, UtilisateurRole.ADMIN);
  }
}