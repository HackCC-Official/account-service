import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Team } from "./team.entity";
import { TeamService } from "./team.service";
import { TeamController } from "./team.controller";
import { AccountModule } from "src/account/account.module";

@Module({
  imports: [TypeOrmModule.forFeature([ Team ]), AccountModule],
  providers: [TeamService],
  controllers: [TeamController]
})
export class TeamModule {}