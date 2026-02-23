import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class StockUpDto {
  @IsNumber(
    {},
    { message: 'La quantité à approvisionner doit être de type numérique' },
  )
  @Min(1, {
    message:
      "La quantité minimale d'approvisionnement doit être supérieure à 0",
  })
  @IsNotEmpty({ message: 'La quantité à approvisionner est requise' })
  quantity: number;
}
