import { Transaction } from 'domain/transaction.entity';

export class TransactionViewModel {
  id: string;
  senderId: string;
  receiverId: string;
  amount: string;
  status: 'pending' | 'completed' | 'reversed';
  createdAt: Date;

  constructor(transaction: Transaction) {
    this.id = transaction.id!;
    this.senderId = transaction.senderId;
    this.receiverId = transaction.receiverId;
    this.amount = transaction.amount.toString(); // Convertendo Decimal para string para exibição
    this.status = transaction.status;
    this.createdAt = transaction.createdAt;
  }
}
