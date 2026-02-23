import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';
import { Production, ProductionSchema } from './model/production.model';
import { ReferenceModule } from 'src/reference/reference.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Production.name, schema: ProductionSchema },
    ]),
    ReferenceModule
  ],
  controllers: [ProductionController],
  providers: [ProductionService],
})
export class ProductionModule {}
