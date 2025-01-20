import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountController } from './account/account.controller';
import { AccountService } from './account/account.service';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AccountDTO } from './account/account.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env', '.env.development']
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: [AccountDTO],
            synchronize: true,
        }),
        AccountModule,
    ],
    controllers: [AccountController],
    providers: [AccountService],
})
export class AppModule {}
