import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ArticleStatut } from '../enum/article-statut.enum';

export class UpdateProductDto {
  @IsString({
    message: "Le nom de l'article doit être une chaîne de caractères",
  })
  @IsNotEmpty({ message: "Le nom de l'article est obligatoire" })
  nom_article: string;

  @IsNumber({}, { message: 'Le prix unitaire doit être un nombre' })
  @Min(0, { message: 'Le prix unitaire ne peut pas être négatif' })
  @IsOptional()
  prix_unitaire?: number;

  @IsEnum(ArticleStatut, { message: "L'unité doit être une valeur valide" })
  @IsNotEmpty({ message: "L'unité est obligatoire" })
  unite: ArticleStatut;
}
