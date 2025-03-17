import { Injectable } from '@nestjs/common';
import { Counter, Histogram, register } from 'prom-client'; // Importa as métricas do Prometheus

@Injectable()
export class MonitoringService {
  // Crie um contador para monitorar a quantidade de transações criadas
  private transactionCounter = new Counter({
    name: 'transactions_created_total',
    help: 'Total number of transactions created',
    labelNames: ['status'], // Podemos adicionar status da transação (ex: 'success', 'failure')
  });

  // Crie um contador para monitorar a quantidade de transações revertidas
  private reversalCounter = new Counter({
    name: 'transactions_reversed_total',
    help: 'Total number of transactions reversed',
    labelNames: ['status'], // Podemos adicionar status de reversão (ex: 'success', 'failure')
  });

  // Crie um histograma para medir o tempo de execução de transações
  private transactionDurationHistogram = new Histogram({
    name: 'transactions_duration_seconds',
    help: 'Histogram of transaction execution duration in seconds',
    buckets: [0.1, 0.5, 1, 2, 5, 10], // Definindo intervalos de tempo
  });

  // Função para registrar a execução de uma transação
  logTransactionDuration(method: string, startTime: number) {
    const duration = (Date.now() - startTime) / 1000; // Tempo de execução em segundos
    this.transactionDurationHistogram.observe(duration);
    console.log(`Method ${method} executed in ${duration}s`);
  }

  // Função para registrar o sucesso ou falha de uma transação
  logTransactionStatus(status: string) {
    this.transactionCounter.inc({ status }); // Incrementa o contador com o status da transação
  }

  // Função para registrar o sucesso ou falha de uma reversão
  logReversalStatus(status: string) {
    this.reversalCounter.inc({ status }); // Incrementa o contador com o status da reversão
  }

  // Função para registrar erros
  logError(method: string, error: Error) {
    console.error(`Error in method ${method}:`, error.message);
  }

  // Função assíncrona que retorna as métricas coletadas pelo Prometheus
  async getMetrics(): Promise<string> {
    return register.metrics(); // Retorna as métricas como uma string (como Promise)
  }
}
