import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'panier_ventes' })
export class PanierVente extends Document {
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
    type: Number,
    default: 0,
  })
  prix_unitaire: Number;

  @Prop({
    type: Types.ObjectId,
    ref: 'Vente',
  })
  vente_id: Types.ObjectId;
}

export const PanierVenteSchema = SchemaFactory.createForClass(PanierVente);
