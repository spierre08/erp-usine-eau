import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { CategoryTransactionEnum } from '../enum/category.enum';
import { TypeDepenseEnum } from '../enum/type.enum';

@Schema({ timestamps: true, collection: 'transactions' })
export class Transaction extends Document {
  @Prop({})
  ref_transaction: string;

  @Prop()
  description: string;

  @Prop({
    type: String,
    enum: CategoryTransactionEnum,
  })
  categorie_transaction: CategoryTransactionEnum;

  @Prop({
    type: Number,
    default: 0,
  })
  montant: number;

  @Prop({
    type: String,
    enum: TypeDepenseEnum,
  })
  type_transaction: TypeDepenseEnum;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
  })
  user_id: mongoose.Schema.Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
