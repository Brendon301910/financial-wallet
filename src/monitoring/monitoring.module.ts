import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MonitoringService } from './monitoring.service';

@Module({
  imports: [PrometheusModule.register()],
  providers: [MonitoringService],
  exports: [PrometheusModule, MonitoringService],
})
export class MonitoringModule {}
