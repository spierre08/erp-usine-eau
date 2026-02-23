import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdatePanierVenteDto {
  @IsString({ message: "L'id de l'article doit être type chaine" })
  @IsOptional()
  article_id: string;

  @IsNumber({}, { message: 'La quantite doit être type de numérique' })
  @Min(1, { message: 'La quantité mininale doit être un' })
  @IsNotEmpty({ message: 'La quantite est requis' })
  quantite: number;
}
