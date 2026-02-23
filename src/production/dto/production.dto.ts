import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ProductionStatus } from '../enum/production.eum';

export class ProductionDto {
  @IsNotEmpty({ message: 'La quantité produite est requise' })
  @IsNumber({}, { message: 'La quantité produite doit être de type numérique' })
  @Min(0, { message: 'La quantité produite doit commencer à partire de 0' })
  quantite_produite: number;

  @IsNotEmpty({ message: 'Le filme consommé doit être est requis' })
  @IsNumber({}, { message: 'Le filme consommé doit être de type numérique' })
  @Min(0, { message: 'Le filme consommé doit commencer à partire de 0' })
  film_consomme: number;

  @IsNotEmpty({ message: 'La perte est requise' })
  @IsNumber({}, { message: 'La perte doit être de type numérique' })
  @Min(0, { message: 'La perte doit commencer à partir de 0' })
  perte: number;

  @IsEnum(ProductionStatus, { message: 'Le statut doit être l\'un des statuts valides' })
  @IsOptional()
  status: ProductionStatus;
}
