import { Module } from '@nestjs/common';
import { MouvementStockService } from './mouvement-stock.service';
import { MouvementStockController } from './mouvement-stock.controller';
import { ReferenceModule } from 'src/reference/reference.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MouvementStock,
  MouvementStockSchema,
} from './model/mouvement-stock.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MouvementStock.name, schema: MouvementStockSchema },
    ]),
    ReferenceModule,
  ],
  controllers: [MouvementStockController],
  providers: [MouvementStockService],
  exports: [MouvementStockService],
})
export class MouvementStockModule {}
