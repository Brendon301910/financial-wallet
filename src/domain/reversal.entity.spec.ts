import { Reversal } from './reversal.entity';
import Decimal from 'decimal.js';

describe('Reversal Entity', () => {
  it('should create a reversal with valid data', () => {
    const validReversalProps = {
      transactionId: '3f7b7bc4-df57-4ed3-8351-e5b7db6e9d72',
      reason: 'Fraud detection',
      createdAt: new Date(),
    };

    const [reversal, error] = Reversal.create(validReversalProps);

    expect(error).toBeNull();
    expect(reversal).not.toBeNull();
    if (reversal) {
      expect(reversal.transactionId).toBe(validReversalProps.transactionId);
      expect(reversal.reason).toBe(validReversalProps.reason);
      expect(reversal.createdAt).toBeInstanceOf(Date);
    }
  });

  it('should throw error if reason is less than 5 characters', () => {
    const invalidReversalProps = {
      transactionId: '3f7b7bc4-df57-4ed3-8351-e5b7db6e9d72',
      reason: 'Fra',
      createdAt: new Date(),
    };

    const [reversal, error] = Reversal.create(invalidReversalProps);

    expect(reversal).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe('Reason must have at least 5 characters');
  });

  it('should throw error if transactionId is not a valid UUID', () => {
    const invalidReversalProps = {
      transactionId: 'invalid-uuid',
      reason: 'Fraud detection',
      createdAt: new Date(),
    };

    const [reversal, error] = Reversal.create(invalidReversalProps);

    expect(reversal).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe('Invalid transaction ID');
  });

  it('should create a reversal with current date if createdAt is not provided', () => {
    const validReversalProps = {
      transactionId: '3f7b7bc4-df57-4ed3-8351-e5b7db6e9d72',
      reason: 'Fraud detection',
    };

    const [reversal, error] = Reversal.create(validReversalProps);

    expect(error).toBeNull();
    expect(reversal).not.toBeNull();
    if (reversal) {
      expect(reversal.createdAt).toBeInstanceOf(Date);
      expect(reversal.createdAt.getTime()).toBeLessThanOrEqual(
        new Date().getTime(),
      );
    }
  });
});
