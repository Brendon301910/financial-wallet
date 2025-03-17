import { Module } from '@nestjs/common';
import { HttpModule } from './infra/http/http.module';
import { DatabaseModule } from './infra/database/database.module';
import { LoggerModule } from './infra/logger/logger.module';

@Module({
  imports: [HttpModule, DatabaseModule, LoggerModule],
})
export class AppModule {}
