import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Account } from './account/account.entity';
import { LoggerModule } from 'nestjs-pino';

@Module({
    imports: [
        LoggerModule.forRoot({
            pinoHttp: {
              autoLogging: false,
              quietReqLogger: true,
              transport: {
                target: 'pino-pretty',
              },
            },
          }),
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