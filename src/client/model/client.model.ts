import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'clients' })
export class Client extends Document {
  @Prop()
  nom: string;

  @Prop()
  tel: string;

  @Prop()
  adresse: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  estActif: boolean;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
