import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsController } from './accounts/accounts.controller';
import { ApplicationsController } from './applications/applications.controller';
import { AttendanceController } from './attendance/attendance.controller';

@Module({
  imports: [],
  controllers: [AppController, AccountsController, ApplicationsController, AttendanceController],
  providers: [AppService],
})
export class AppModule {}
