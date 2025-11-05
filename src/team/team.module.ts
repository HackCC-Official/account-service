import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Team } from "./team.entity";
import { TeamService } from "./team.service";
import { TeamController } from "./team.controller";
import { AccountModule } from "src/account/account.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([ Team ]), AccountModule, AuthModule],
    providers: [TeamService],
    controllers: [TeamController],
    exports: [TeamService]
})
export class TeamModule {}
