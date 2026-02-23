import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { PersonnelModule } from './personnel/personnel.module';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { ProductionModule } from './production/production.module';
import { ArticleModule } from './article/article.module';
import { VenteModule } from './vente/vente.module';
import { PanierVenteModule } from './panier-vente/panier-vente.module';
import { MouvementStockModule } from './mouvement-stock/mouvement-stock.module';
import { ReferenceModule } from './reference/reference.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('DB_URL');
        return { uri };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientModule,
    UtilisateurModule,
    PersonnelModule,
    SeedModule,
    AuthModule,
    ProductionModule,
    ArticleModule,
    VenteModule,
    PanierVenteModule,
    MouvementStockModule,
    ReferenceModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
