import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountDTO } from './account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';

@Module({
    imports: [TypeOrmModule.forFeature([AccountDTO])],
    providers: [AccountService],
    controllers: [AccountController],
})
export class AccountModule {}
