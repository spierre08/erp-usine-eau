import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TypeMouvementStock } from '../enum/type-mouvement.dto';

@Schema({ timestamps: true, collection: 'mouvement_stocks' })
export class MouvementStock extends Document {
  @Prop()
  reference: String;

  @Prop({
    type: Types.ObjectId,
    ref: 'Article',
  })
  article_id: Types.ObjectId;

  @Prop({
    type: Number,
    default: 0,
  })
  quantite: number;

  @Prop({
    type: String,
    enum: Object.values(TypeMouvementStock),
    default: TypeMouvementStock.ENTRE,
  })
  type_mouvement: TypeMouvementStock;
}

export const MouvementStockSchema =
  SchemaFactory.createForClass(MouvementStock);
