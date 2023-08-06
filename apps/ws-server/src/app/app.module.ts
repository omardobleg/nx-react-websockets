import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PollingModule } from '../polling/polling.module';

@Module({
  imports: [PollingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
