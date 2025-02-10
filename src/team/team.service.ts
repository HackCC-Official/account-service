import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Team } from "./team.entity";
import { Repository } from "typeorm";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { RequestTeamDTO } from "./request-team.dto";
import { Account } from "src/account/account.entity";

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectPinoLogger(TeamService.name)
    private readonly logger: PinoLogger
  ) {}

  /**
   * 
   * @returns {Promise<Team[]>} Teams Array
   */
  async getAll(): Promise<Team[]> {
    return this.teamRepository.find();
  }

  /**
   * 
   * @param {id} Team ID 
   * @returns {Promise<Team>} Team Entity
   */
  async getByIdOrFail(id: string): Promise<Team> {
    return this.teamRepository.findOneByOrFail({ id })
  }

  /**
   * 
   * @param {createTeamDTO} Account Creation DTO 
   * @returns {Promise<Team>} Team Entity
   */
  async create(createTeamDTO: RequestTeamDTO): Promise<Team> {
    const team = await this.teamRepository.save({
      ...createTeamDTO,
      account: createTeamDTO.account_ids.map(a => {
        const account = new Account()
        account.id = a
        return account
      }),
      createdAt: (new Date()).toISOString()
    })

    this.logger.info({ msg: 'Creating team', team });

    return team
  }

  /**
   * 
   * @param {id} Team ID 
   * @param {updateTeamDTO} Team Update DTO
   * @returns {Promise<Team>} Team Entity
   */
  async put(id: string, updateTeamDTO: RequestTeamDTO): Promise<Team> {
    // get team
    const team = await this.getByIdOrFail(id);
    
    team.name = updateTeamDTO.name;
    team.accounts = updateTeamDTO.account_ids.map(a => {
      const account = new Account()
      account.id = a
      return account
    })

    this.logger.info({ msg: 'Updating team', team });

    return this.teamRepository.save(team)
  }
}