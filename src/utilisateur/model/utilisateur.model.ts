import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { UtilisateurRole } from '../enum/utilisateur-role.enum';

@Schema({ timestamps: true, collection: 'utilisateurs' })
export class Utilisateur extends Document {
  @Prop()
  nom_utilisateur: string;

  @Prop()
  password: string;

  @Prop({
    type: String,
    enum: Object.values(UtilisateurRole),
  })
  role: UtilisateurRole;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Personnel',
  })
  personnel_id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    default: 'ACTIF',
  })
  statut: 'ACTIF' | 'SUSPENDU' | 'DESACTIVE';
}

export const UtilisateurSchema = SchemaFactory.createForClass(Utilisateur);
