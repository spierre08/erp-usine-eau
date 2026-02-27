import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly utilisateurService: UtilisateurService,
    private readonly jwtService: JwtService,
  ) {}

  async login(authDto: AuthDto) {
      const utilisateur = await this.utilisateurService.getByUser(
      authDto.nom_utilisateur,
    );

    if (!utilisateur) {
      throw new ForbiddenException('Utilisateur ou mot de passe incorrecte !');
    }

    const isPasswordValid = await argon2.verify(
      utilisateur.password,
      authDto.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Utilisateur ou mot de passe incorrecte !');
    }

    if (utilisateur.statut === "SUSPENDU" || utilisateur.statut === "DESACTIVE"){
      throw new UnauthorizedException('Compte désactivé ou suspendu !');
    }

    const payload = {
      sub: utilisateur._id,
      username: utilisateur.nom_utilisateur,
      role: utilisateur.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      id: utilisateur.id,
      nom_utilisateur: utilisateur.nom_utilisateur,
      role: utilisateur.role,
      statut: utilisateur.statut,
      token,
    };
  }

  async updatePassword(id: string, password: string) {
    return this.utilisateurService.updatePassword(id, password);
  }
}
