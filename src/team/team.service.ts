import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Team } from "./team.entity";
import { Repository } from "typeorm";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { RequestTeamDTO } from "./request-team.dto";
import { Account } from "src/account/account.entity";
import { ResponseTeamDTO } from "./response-team.dto";
import { AccountService } from "src/account/account.service";

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    private accountService: AccountService,
    @InjectPinoLogger(TeamService.name)
    private readonly logger: PinoLogger
  ) {}

  /**
   * 
   * @returns {Promise<Team[]>} Teams Array
   */
  async getAll(): Promise<Team[]> {
    return this.teamRepository.find({
      relations: {
        accounts: true
      }
    });
  }

  /**
   * 
   * @param {id} Team ID 
   * @returns {Promise<Team>} Team Entity
   */
  async getByIdOrFail(id: string): Promise<Team> {
    return this.teamRepository.findOneOrFail({
      where: { id },
      relations: { accounts: true }
    })
  }

  /**
   * 
   * @param {createTeamDTO} Account Creation DTO 
   * @returns {Promise<Team>} Team Entity
   */
  async create(createTeamDTO: RequestTeamDTO): Promise<Team> {
    const accounts: Account[] = [];

    for (const account_id of createTeamDTO.account_ids) {
      const account = await this.accountService.getByIdOrFail(account_id)
      if (account.team) {
        this.logger.info({ msg: 'Account already got team', account})
        throw new Error('Account with id ' + account.id + ' and email ' + account.email + ' already got a team');
      } else {
        accounts.push(account)
      }
    }

    console.log(accounts)

    const team = await this.teamRepository.save({
      name: createTeamDTO.name,
      createdAt: (new Date()).toISOString(),
      accounts
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
  async update(id: string, updateTeamDTO: RequestTeamDTO): Promise<Team> {
    // get team
    const team = await this.getByIdOrFail(id);

    const newAccounts: Account[] = [];

    for (const account_id of updateTeamDTO.account_ids) {
      const account = await this.accountService.getByIdOrFail(account_id)
      newAccounts.push(account)
    }

    // 2. Remove accounts no longer in the team (optional)
  const oldAccounts = team.accounts || [];
  for (const oldAccount of oldAccounts) {
    if (!newAccounts.some(a => a.id === oldAccount.id)) {
      oldAccount.team = null; // Or assign to another team
      await this.accountService.update(oldAccount.id, oldAccount); // Ensure this updates the DB
    }
  }

  // 3. Assign new accounts to this team
  for (const newAccount of newAccounts) {
    newAccount.team = team; // Sync the inverse side!
    await this.accountService.update(newAccount.id, newAccount); // Save changes
  }

  
  team.name = updateTeamDTO.name;
  team.accounts = newAccounts;

  this.logger.info({ msg: 'Updating team', team });

  return this.teamRepository.save(team)
  }

  async delete(id: string): Promise<void> {
    const team = await this.getByIdOrFail(id);

    this.logger.info({ msg: 'Deleting team', team });
    this.teamRepository.delete(id)
  }
}