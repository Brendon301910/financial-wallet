import { Controller, Get } from '@nestjs/common';
import { MonitoringService } from './monitoring.service'; // Corrigir o caminho de importação do service
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'; // Importação das anotações do Swagger

@ApiTags('Metrics') // Define o nome da categoria das métricas no Swagger
@Controller('metrics')
export class MetricsController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @ApiOperation({ summary: 'Get application metrics' }) // Adicionando a operação no Swagger
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the metrics',
    type: String, // O retorno será uma string, como o conteúdo do endpoint /metrics
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get()
  async getMetrics(): Promise<string> {
    return this.monitoringService.getMetrics(); // Espera a Promise ser resolvida
  }
}
