import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Account } from './account/account.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env', '.env.local']
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            synchronize: true,
            entities: [Account]
        }),
        AccountModule,
    ],
})
export class AppModule {}