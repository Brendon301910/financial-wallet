import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MonitoringService } from './monitoring.service'; // Importe o seu serviço de monitoramento

@Module({
  imports: [PrometheusModule.register()],
  providers: [MonitoringService], // Adicione o MonitoringService nos providers
  exports: [PrometheusModule, MonitoringService], // Exporte também o MonitoringService para que possa ser injetado em outros módulos
})
export class MonitoringModule {}
