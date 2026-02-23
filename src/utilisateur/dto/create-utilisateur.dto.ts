import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { UtilisateurRole } from '../enum/utilisateur-role.enum';

export class CreateUtilisateurDto {
  @IsString({ message: "Le nom de l'utilisateur doit être de type chaine !" })
  @IsNotEmpty({ message: "Le nom de l'utilisateur est requis !" })
  nom_utilisateur: string;

  @IsString({ message: 'Le mot de passe doit être de type chaine !' })
  @IsNotEmpty({ message: 'Le mot de passe est requis !' })
  password: string;

  @IsString({ message: 'Le personnel doit être de type chaine !' })
  @IsNotEmpty({ message: 'Le personnel est requis !' })
  personnel_id?: string;

  @IsString({ message: 'Le rôle doit être de type chaine !' })
  @IsEnum(UtilisateurRole, {
    message: 'Le role utilisateur que vous avez choisi est invalide !',
  })
  @IsNotEmpty({ message: 'Le rôle est requis !' })
  role: UtilisateurRole;
}
