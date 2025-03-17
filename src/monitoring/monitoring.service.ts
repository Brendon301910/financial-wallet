import { Injectable } from '@nestjs/common';
import { Counter, Histogram, register } from 'prom-client';

@Injectable()
export class MonitoringService {
  private transactionCounter = new Counter({
    name: 'transactions_created_total',
    help: 'Total number of transactions created',
    labelNames: ['status'],
  });

  private reversalCounter = new Counter({
    name: 'transactions_reversed_total',
    help: 'Total number of transactions reversed',
    labelNames: ['status'],
  });

  private transactionDurationHistogram = new Histogram({
    name: 'transactions_duration_seconds',
    help: 'Histogram of transaction execution duration in seconds',
    buckets: [0.1, 0.5, 1, 2, 5, 10],
  });

  logTransactionDuration(method: string, startTime: number) {
    const duration = (Date.now() - startTime) / 1000;
    this.transactionDurationHistogram.observe(duration);
    console.log(`Method ${method} executed in ${duration}s`);
  }

  logTransactionStatus(status: string) {
    this.transactionCounter.inc({ status });
  }

  logReversalStatus(status: string) {
    this.reversalCounter.inc({ status });
  }

  logError(method: string, error: Error) {
    console.error(`Error in method ${method}:`, error.message);
  }

  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}
