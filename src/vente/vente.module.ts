import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VenteService } from './vente.service';
import { VenteController } from './vente.controller';
import { Vente, VenteSchema } from './model/vente.model';
import { ClientModule } from 'src/client/client.module';
import { PanierVenteModule } from 'src/panier-vente/panier-vente.module';
import { ArticleModule } from 'src/article/article.module';
import { MouvementStockModule } from 'src/mouvement-stock/mouvement-stock.module';
import { ReferenceModule } from 'src/reference/reference.module';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vente.name, schema: VenteSchema }]),
    ClientModule,
    forwardRef(() => PanierVenteModule),
    ArticleModule,
    MouvementStockModule,
    ReferenceModule,
    UtilisateurModule
  ],
  controllers: [VenteController],
  providers: [VenteService],
  exports: [VenteService],
})
export class VenteModule {}
