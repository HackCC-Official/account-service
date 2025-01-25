import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountProducerModule } from 'src/account-queue/account-producer.module';

@Module({
    imports: [TypeOrmModule.forFeature([Account]), AccountProducerModule],
    providers: [AccountService],
    controllers: [AccountController],
})
export class AccountModule {}
