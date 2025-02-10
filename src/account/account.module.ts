import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountProducerModule } from 'src/account-producer/account-producer.module';
import { Team } from 'src/team/team.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Account, Team]), AccountProducerModule],
    providers: [AccountService],
    controllers: [AccountController],
    exports: [AccountService]
})
export class AccountModule {}
