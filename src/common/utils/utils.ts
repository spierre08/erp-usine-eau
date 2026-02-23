import { Types } from 'mongoose';

export class Util {
  static ObjectId = Types.ObjectId;

  static generateReceiptNumber = () => {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `${datePart}-${randomPart}`;
  };
}
