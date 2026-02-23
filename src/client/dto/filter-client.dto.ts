import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';

export class FilterClientDto {
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsOptional()
  @IsNotEmpty()
  nom: string;

  @IsString({
    message: 'Le numéro de téléphone doit être une chaîne de caractères',
  })
  @IsOptional()
  tel: string;

  @IsString({ message: "L'adresse doit être une chaîne de caractères" })
  @IsOptional()
  adresse: string;

  @IsNumber()
  @IsOptional()
  page: number;

  @IsNumber()
  @IsOptional()
  limit: number;
}
