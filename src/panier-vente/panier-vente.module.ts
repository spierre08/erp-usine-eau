import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PanierVente, PanierVenteSchema } from './model/panier-vente.model';
import { PanierVenteService } from './panier-vente.service';
import { PanierVenteController } from './panier-vente.controller';
import { ClientModule } from 'src/client/client.module';
import { VenteModule } from 'src/vente/vente.module';
import { MouvementStockModule } from 'src/mouvement-stock/mouvement-stock.module';
import { ArticleModule } from 'src/article/article.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PanierVente.name, schema: PanierVenteSchema },
    ]),
    ClientModule,
    forwardRef(() => VenteModule),
    MouvementStockModule,
    ArticleModule,
  ],
  controllers: [PanierVenteController],
  providers: [PanierVenteService],
  exports: [PanierVenteService],
})
export class PanierVenteModule {}
