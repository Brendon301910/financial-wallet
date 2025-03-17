// src/logger/logger.module.ts

import { Module } from '@nestjs/common';
import { CustomLoggerService } from './logger.service';

@Module({
  providers: [CustomLoggerService],
  exports: [CustomLoggerService], // Expõe o LoggerService para ser utilizado em outros módulos
})
export class LoggerModule {}
