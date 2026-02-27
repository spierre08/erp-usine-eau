import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class ReferenceService {
  private lastCounts: Record<string, number> = {};

  generate(prefix: string, countToday: number) {
    const date = dayjs().format('YYYY-MM-DD');
    const counter = String(countToday + 1).padStart(2, '0');

    return `${prefix}-${date}-${counter}`;
  }

  generateSallReference(prefix: string, counterDigits = 2) {
    if (!prefix) throw new Error('Le préfixe ne peut pas être vide');

    const date = dayjs().format('YYYY-MM-DD');

    const count = (this.lastCounts[date] || 0) + 1;
    this.lastCounts[date] = count;

    const counter = String(count).padStart(counterDigits, '0');

    return `${prefix}-${date}-${counter}`;
  }


  generateTransactionReference(prefix: string, counterDigits = 2) {
    if (!prefix) throw new Error('Le préfixe ne peut pas être vide');

    const date = dayjs().format('YYYY-MM-DD');

    const count = (this.lastCounts[date] || 0) + 1;
    this.lastCounts[date] = count;

    const counter = String(count).padStart(counterDigits, '0');

    return `${prefix}-${date}-${counter}`;
  }
}
