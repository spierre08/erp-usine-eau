import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreatePersonnelDto {
  @IsString({ message: 'Le nom doit être de type chaine !' })
  @IsNotEmpty({ message: 'Le nom est requis !' })
  nom: string;

  @IsString({ message: 'Le prenom doit être de type chaine !' })
  @IsNotEmpty({ message: 'Le prenom est requis !' })
  prenom: string;

  @IsString({ message: 'Le numero de telephone doit être de type chaine !' })
  @IsNotEmpty({ message: 'Le numero de telephone est requis !' })
  tel: string;

  @IsString({ message: "L'adresse doit être de type chaine !" })
  @IsNotEmpty({ message: "L'adresse est requise !" })
  adresse: string;

  @IsString({ message: 'Le role doit être de type chaine !' })
  @IsNotEmpty({ message: 'Le role est requis !' })
  @IsEnum(['ADMIN', 'COMPTABLE', 'CHAUFFEUR', 'PRODUCTION', 'FOURNISSEUR'], {
    message: 'Le role que vous avez choisi est invalide !',
  })
  role: string;

  @IsString({ message: 'Le sexe doit être de type chaine !' })
  @IsNotEmpty({ message: 'Le sexe est requis !' })
  @IsEnum(['HOMME', 'FEMME'], {
    message: 'Le sexe que vous avez choisi est invalide !',
  })
  sexe: string;
  
  @IsNumber({}, { message: 'Le salaire de base doit être un nombre !' })
  @Min(0, { message: 'Le salaire de base doit être positif !' })
  @IsOptional()
  salaire_base: number;
}
