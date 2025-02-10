import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { TeamService } from "./team.service";
import { ApiOperation, ApiParam } from "@nestjs/swagger";
import { ResponseTeamDTO } from "./response-team.dto";
import { RequestTeamDTO } from "./request-team.dto";

@Controller('teams')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get()
  @ApiOperation({
    summary: 'Finds all Teams'
  })
  async findAll(): Promise<ResponseTeamDTO[]> {
    return await this.teamService.getAll()
  }

  @Get(':team_id')
  @ApiOperation({
    summary: 'Finds a Team by team_id'
  })
  @ApiParam({
    description: 'ID of an existing team',
    name: 'team_id'
  })
  async find(@Param('team_id') id: string) {
    return await this.teamService.getByIdOrFail(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Creates a Team of hackers at the hackathon'
  })
  async create(
    @Body() createTeamDTO: RequestTeamDTO
  ): Promise<ResponseTeamDTO> {
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
  async delete(
    @Param('team_id') id: string,
  ): Promise<void> {
    await this.teamService.delete(id);
  }
}