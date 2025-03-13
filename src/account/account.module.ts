import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountProducerModule } from 'src/account-producer/account-producer.module';
import { Team } from 'src/team/team.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([Account, Team]), AccountProducerModule, AuthModule, ConfigService],
    providers: [AccountService],
    controllers: [AccountController],
    exports: [AccountService]
})
export class AccountModule {}
