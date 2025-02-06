import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from 'src/account/account.module';

@Module({
    imports: [
        AccountModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
        })

    ],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
