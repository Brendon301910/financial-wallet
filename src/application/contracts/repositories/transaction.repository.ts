import { Transaction } from 'domain/transaction.entity';

export abstract class ITransactionRepository {
  abstract save(transaction: Transaction): Promise<void>;
  abstract update(transaction: Transaction): Promise<void>;
  abstract findById(id: string): Promise<Transaction | null>;
}
