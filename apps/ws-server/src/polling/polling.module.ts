import { Module } from '@nestjs/common';
import { PollingGateway } from './polling.gateway';
import { PollingService } from './polling.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PollingGateway, PollingService],
  exports: [PollingService],
})
export class PollingModule {}
