import { IsNotEmpty, IsString, IsNumber, IsEnum, Min, IsMongoId } from "class-validator";
import { CategoryTransactionEnum } from "../enum/category.enum";
import { TypeDepenseEnum } from "../enum/type.enum";

export class CreateTransactionDto {

    @IsString({ message: 'La description doit etre une chaine de caractere' })
    @IsNotEmpty({ message: 'La description est obligatoire' })
    description: string

    @IsString({ message: 'La categorie doit etre une chaine de caractere' })
    @IsNotEmpty({ message: 'La categorie est obligatoire' })
    @IsEnum(CategoryTransactionEnum, { message: 'La categorie doit etre une categorie valide' })
    categorie_transaction: CategoryTransactionEnum

    @IsNumber({},{ message: 'Le montant doit etre un nombre' })
    @IsNotEmpty({ message: 'Le montant est obligatoire' })
    @Min(1, { message: 'Le montant doit etre superieur a 1' })
    montant: number

    @IsEnum(TypeDepenseEnum, { message: 'Le type doit etre un type valide' })
    @IsNotEmpty({ message: 'Le type est obligatoire' })
    type_transaction: TypeDepenseEnum

    @IsString({ message: 'L utilisateur doit etre une chaine de caractere' })
    @IsMongoId({ message: 'L utilisateur doit etre un id valide' })
    @IsNotEmpty({ message: 'L utilisateur est obligatoire' })
    user_id: string
}
