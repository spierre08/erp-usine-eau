import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductionStatus } from '../enum/production.eum';

@Schema({ timestamps: true, collection: 'productions' })
export class Production extends Document {
  @Prop()
  code_lot: string;

  @Prop({
    type: Number,
    default: 0,
  })
  quantite_produite: number;

  @Prop({
    type: Number,
    default: 0,
  })
  film_consomme: number;

  @Prop({
    type: Number,
    default: 0,
  })
  perte: number;

  @Prop({
    type: String,
    enum: Object.values(ProductionStatus),
    default: ProductionStatus.EN_COURS,
  })
  status: ProductionStatus;
}

export const ProductionSchema = SchemaFactory.createForClass(Production);
