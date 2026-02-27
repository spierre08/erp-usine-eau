import { IsNotEmpty, MinLength, IsString } from "class-validator";

export class UpdatePasswordDto {
    @IsNotEmpty({ message: "Le mot de passe est requis !" })
    @MinLength(6, { message: "Le mot de passe doit contenir au moins 6 caracteres !" })
    @IsString({ message: "Le mot de passe doit etre une chaine de caracteres !" })
    password: string;
}