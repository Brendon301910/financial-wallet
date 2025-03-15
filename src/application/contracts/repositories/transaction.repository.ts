import { Transaction } from 'domain/transaction.entity';

export abstract class ITransactionRepository {
  abstract save(transaction: Transaction): Promise<void>;
}
