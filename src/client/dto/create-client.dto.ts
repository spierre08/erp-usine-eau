import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateClientDto {
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  nom: string;

  @IsString({ message: 'Le numéro de téléphone doit être un nombre' })
  @IsNotEmpty({ message: 'Le numéro de téléphone est requis' })
  @Length(9, 9, { message: 'Le numéro de téléphone doit avoir 9 chiffres' })
  @Matches(/^\d{9}$/, {
    message: 'Le numéro de téléphone doit contenir uniquement des chiffres',
  })
  @IsPhoneNumber('GN', {
    message:
      'Le numéro de téléphone doit être un numéro de téléphone valide en Guinée',
  })
  tel: string;

  @IsString({ message: "L'adresse doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "L'adresse est requise" })
  adresse: string;

  @IsBoolean({ message: 'Le statut doit être un booléen' })
  @IsOptional()
  estActif: boolean;
}
