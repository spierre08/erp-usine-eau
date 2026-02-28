import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class StockDownDto {
  @IsNumber(
    {},
    { message: 'La quantité à retirer doit être de type numérique' },
  )
  @Min(1, {
    message:
      "La quantité minimale à retirer doit être supérieure à 0",
  })
  @IsNotEmpty({ message: 'La quantité à retirer est requise' })
  quantity: number;
}
