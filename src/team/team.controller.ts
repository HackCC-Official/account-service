import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { TeamService } from "./team.service";
import { ApiOperation, ApiParam } from "@nestjs/swagger";
import { ResponseTeamDTO } from "./response-team.dto";
import { RequestTeamDTO } from "./request-team.dto";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { AccountRoles } from "src/account/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { AuthRequest } from "src/auth/auth-request";

@Controller('teams')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get()
  @ApiOperation({
    summary: 'Finds all Teams'
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  async findAll(): Promise<ResponseTeamDTO[]> {
    return await this.teamService.getAll()
  }

  @Get('account/:account_id')
  @ApiOperation({
    summary: 'Find a team associated with the account_id'
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  async findTeamByAccountId(
    @Param('account_id') account_id: string,
    @Req() request: AuthRequest
  ): Promise<ResponseTeamDTO[]> {
    if (request.user.sub !== account_id) {
      throw new Error(`You don't have enough permissions`)
    }
    return await this.teamService.getByAccountId(account_id)
  }


  @Get(':team_id')
  @ApiOperation({
    summary: 'Finds a Team by team_id'
  })
  @ApiParam({
    description: 'ID of an existing team',
    name: 'team_id'
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  async find(@Param('team_id') id: string) {
    return await this.teamService.getByIdOrFail(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Creates a Team of hackers at the hackathon'
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  async create(
    @Body() createTeamDTO: RequestTeamDTO,
    @Req() request: AuthRequest
  ): Promise<ResponseTeamDTO> {
    const user = request.user
    if (!user.user_roles.includes(AccountRoles.ADMIN)) {
      createTeamDTO.account_ids = [user.sub]
      return await this.teamService.create(createTeamDTO);
    }
    return await this.teamService.create(createTeamDTO);
  }

  @Put(':team_id')
  @ApiOperation({
    summary: 'Updates an existing Team'
  })
  @ApiParam({
    description: 'ID of an existing team',
    name: 'team_id'
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  async update(
    @Param('team_id') id: string,
    @Body() updateTeamDTO: RequestTeamDTO
  ): Promise<ResponseTeamDTO> {
    return await this.teamService.update(id, updateTeamDTO);
  }

  @Delete(':team_id')
  @ApiOperation({
    summary: 'Deletes an existing Team'
  })
  @ApiParam({
    description: 'ID of an existing team',
    name: 'team_id'
  })  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  async delete(
    @Param('team_id') id: string,
  ): Promise<void> {
    await this.teamService.delete(id);
  }
}