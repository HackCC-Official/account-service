import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Account } from './account/account.entity';
import { LoggerModule } from 'nestjs-pino';
import { AccountProducerModule } from './account-queue/account-producer.module';

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
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: "postgres",
            host: configService.get<string>('DATABASE_HOST'),
            port: configService.get<number>('DATABASE_PORT'),
            username: configService.get<string>('DATABASE_USERNAME'),
            password: configService.get<string>('DATABASE_PASSWORD'),
            database: configService.get<string>('DATABASE_DB'),
            entities: [Account],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        AccountModule,
        AccountProducerModule,
    ],
})
export class AppModule {}