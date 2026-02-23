import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Utilisateur,
  UtilisateurSchema,
} from 'src/utilisateur/model/utilisateur.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Utilisateur.name, schema: UtilisateurSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
