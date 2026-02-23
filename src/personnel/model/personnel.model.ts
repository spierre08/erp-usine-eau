import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'personnels' })
export class Personnel extends Document {
  @Prop()
  nom: string;

  @Prop()
  prenom: string;

  @Prop({
    type: String,
    enum: ['HOMME', 'FEMME'],
  })
  sexe: string;

  @Prop()
  tel: string;

  @Prop()
  adresse: string;

  @Prop({
    type: String,
    enum: ['ADMIN', 'COMPTABLE', 'CHAUFFEUR', 'PRODUCTION', 'FOURNISSEUR'],
  })
  role: string;

  @Prop({
    type: String,
    default: 'ACTIF',
  })
  statut: 'ACTIF' | 'SUSPENDU' | 'DESACTIVE';

  @Prop({
    type: Number,
    default: 0,
  })
  salaire_base: number;
}

export const PersonnelSchema = SchemaFactory.createForClass(Personnel);
