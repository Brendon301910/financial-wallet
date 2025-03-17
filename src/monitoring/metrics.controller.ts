import { Controller, Get } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @ApiOperation({ summary: 'Get application metrics' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the metrics',
    type: String,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get()
  async getMetrics(): Promise<string> {
    return this.monitoringService.getMetrics();
  }
}
