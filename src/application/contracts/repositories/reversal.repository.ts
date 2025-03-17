import { Reversal } from 'domain/reversal.entity';

export abstract class IReversalRepository {
  abstract save(reversal: Reversal): Promise<void>;
}
