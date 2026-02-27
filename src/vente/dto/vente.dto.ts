import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
  IsNumber,
  Min,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StatutEnum } from '../enum/statut-vente.enum';

class CardDataDto {
  @IsMongoId({ message: "L'id de l'article est invalide" })
  article_id: string;

  @IsNumber({}, { message: 'La quantité doit être un nombre' })
  @Min(1, { message: 'La quantité doit être au moins 1' })
  quantite: number;
}

export class VenteDto {
  @IsString({ message: "L'id du client doit être de type chaine" })
  @IsNotEmpty({ message: "L'id du client est requis !" })
  client_id: string;

  @IsString({ message: "L'id de l'utilisateur doit être de type chaine" })
  @IsNotEmpty({ message: "L'id de l'utilisateur est requis !" })
  utilisateur_id: string;

  @IsString({ message: 'Le statut de la vente doit être de type chaine' })
  @IsOptional()
  @IsEnum(StatutEnum, { message: 'Le statut que vous choisi est invalide !' })
  statut_vente: string;

  @IsArray({ message: "Le panier de vente doit être un tableau d'objet" })
  @ArrayNotEmpty({
    message: 'Le panier de vente doit contenir au moins un article',
  })
  @ValidateNested({ each: true })
  @Type(() => CardDataDto)
  cardData: CardDataDto[];
}
