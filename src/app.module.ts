import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Account } from './account/account.entity';
import { LoggerModule } from 'nestjs-pino';
import { AccountProducerModule } from './account-producer/account-producer.module';
import { TeamModule } from './team/team.module';
import { Team } from './team/team.entity';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { Notification } from './notification/notification.entity';

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
            envFilePath: ['.env', '.env.local'],
            isGlobal: true
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
            entities: [Account, Team, Notification],
            synchronize: false,
            migrationsRun: false,
          }),
          inject: [ConfigService],
        }),
        AccountModule,
        AccountProducerModule,
        TeamModule,
        AuthModule,
        NotificationModule
    ],
})
export class AppModule {}