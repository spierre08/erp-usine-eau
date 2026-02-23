import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ArticleStatut } from '../enum/article-statut.enum';

@Schema({ timestamps: true, collection: 'articles' })
export class Article extends Document {
  @Prop()
  nom_article: string;

  @Prop({
    type: Number,
    default: 0,
  })
  stock_actuel: number;

  @Prop({
    type: Number,
    default: 0,
  })
  prix_unitaire: number;

  @Prop({
    type: String,
    enum: Object.values(ArticleStatut),
    default: ArticleStatut.PAQUET,
  })
  unite: ArticleStatut;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
