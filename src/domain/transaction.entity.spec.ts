import { Transaction } from './transaction.entity'; // Ajuste conforme o caminho correto
import Decimal from 'decimal.js';

describe('Transaction', () => {
  it('should create a transaction with valid properties', () => {
    const validTransactionProps = {
      senderId: '3f7b7bc4-df57-4ed3-8351-e5b7db6e9d72',
      receiverId: '8f4b6781-9771-4b39-b1c5-b1fe3c60ea2b',
      amount: new Decimal(100),
    };

    const [transaction, error] = Transaction.create(validTransactionProps);

    expect(error).toBeNull();
    expect(transaction).not.toBeNull();
    if (transaction) {
      expect(transaction.senderId).toBe(validTransactionProps.senderId);
      expect(transaction.receiverId).toBe(validTransactionProps.receiverId);
      expect(transaction.amount.toString()).toBe(
        validTransactionProps.amount.toString(),
      );
      expect(transaction.status).toBe('pending'); // Status padrão
    }
  });

  it('should throw an error if senderId is not a valid UUID', () => {
    const invalidTransactionProps = {
      senderId: 'invalid-uuid',
      receiverId: '8f4b6781-9771-4b39-b1c5-b1fe3c60ea2b',
      amount: new Decimal(100),
    };

    const [transaction, error] = Transaction.create(invalidTransactionProps);

    expect(transaction).toBeNull();
    expect(error).not.toBeNull();
    expect(error?.message).toContain('Invalid sender ID');
  });

  it('should throw an error if receiverId is not a valid UUID', () => {
    const invalidTransactionProps = {
      senderId: '3f7b7bc4-df57-4ed3-8351-e5b7db6e9d72',
      receiverId: 'invalid-uuid',
      amount: new Decimal(100),
    };

    const [transaction, error] = Transaction.create(invalidTransactionProps);

    expect(transaction).toBeNull();
    expect(error).not.toBeNull();
    expect(error?.message).toContain('Invalid receiver ID');
  });

  it('should throw an error if amount is less than or equal to zero', () => {
    const invalidTransactionProps = {
      senderId: '3f7b7bc4-df57-4ed3-8351-e5b7db6e9d72',
      receiverId: '8f4b6781-9771-4b39-b1c5-b1fe3c60ea2b',
      amount: new Decimal(0),
    };

    const [transaction, error] = Transaction.create(invalidTransactionProps);

    expect(transaction).toBeNull();
    expect(error).not.toBeNull();
    expect(error?.message).toContain('Amount must be greater than zero');
  });

  it('should create a transaction with a custom status', () => {
    const validTransactionProps = {
      senderId: '3f7b7bc4-df57-4ed3-8351-e5b7db6e9d72',
      receiverId: '8f4b6781-9771-4b39-b1c5-b1fe3c60ea2b',
      amount: new Decimal(100),
      status: 'completed' as 'completed',
    };

    const [transaction, error] = Transaction.create(validTransactionProps);

    expect(error).toBeNull();
    expect(transaction).not.toBeNull();
    if (transaction) {
      expect(transaction.status).toBe('completed');
    }
  });

  it('should use current date for createdAt when not provided', () => {
    const validTransactionProps = {
      senderId: '3f7b7bc4-df57-4ed3-8351-e5b7db6e9d72',
      receiverId: '8f4b6781-9771-4b39-b1c5-b1fe3c60ea2b',
      amount: new Decimal(100),
    };

    const [transaction, error] = Transaction.create(validTransactionProps);

    expect(error).toBeNull();
    expect(transaction).not.toBeNull();
    if (transaction) {
      expect(transaction.createdAt).toBeInstanceOf(Date);
    }
  });
});
