import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StatutEnum } from '../enum/statut-vente.enum';

@Schema({ timestamps: true, collection: 'ventes' })
export class Vente extends Document {
  @Prop({})
  ref_vente: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Client',
  })
  client_id: Types.ObjectId;

  @Prop({
    type: Date,
    default: new Date(),
  })
  date_vente: Date;

  @Prop({ type: String, enum: Object.values(StatutEnum) })
  statut_vente: StatutEnum;
}

export const VenteSchema = SchemaFactory.createForClass(Vente);
