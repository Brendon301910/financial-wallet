import { Reversal } from 'domain/reversal.entity';

export class ReversalViewModel {
  id: string;
  transactionId: string;
  reason: string;
  createdAt: Date;

  constructor(reversal: Reversal) {
    this.id = reversal.id!;
    this.transactionId = reversal.transactionId;
    this.reason = reversal.reason;
    this.createdAt = reversal.createdAt;
  }
}
