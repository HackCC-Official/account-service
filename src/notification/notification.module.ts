import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notification } from "./notification.entity";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { AccountModule } from "src/account/account.module";
import { TeamModule } from "src/team/team.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([Notification]), AccountModule, TeamModule, AuthModule],
    providers: [NotificationService],
    controllers: [NotificationController]
})
export class NotificationModule {}
