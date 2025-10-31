import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, FindOptionsWhere, In, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Account } from './account.entity';
import { RequestAccountDTO } from './request-account.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AccountProducerService } from 'src/account-producer/account-producer.provider';
import { SupabaseService } from 'src/auth/supabase.service';
import { AccountRoles } from './role.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
        @InjectPinoLogger(AccountService.name)
        private readonly logger: PinoLogger,
        private readonly accountProducer: AccountProducerService,
        private readonly supabaseService: SupabaseService,
        private readonly configService: ConfigService
    ) {}

    /**
     * 
     * @param {string} string
     * @returns {string} string with the first letter capitalized
     */
    capitalizeFirstLetter(text: string = ''): string {
        if (!text) {
            return text; // Return empty string if input is empty
          }
          return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      }

    /**
     * 
     * @returns {Promise<Account[]>} Accounts Array
     * 
     * Consideration: Querying feature
     */
    async getAll(q?: string) : Promise<Account[]> {
        if (q) {
            return this.accountRepository
                .createQueryBuilder('account')
                .where('LOWER(account.email) LIKE LOWER(:query)', { query: `%${q}%` })
                .orWhere("LOWER(CONCAT(account.firstName, ' ', account.lastName)) LIKE LOWER(:query)", {
                    query: `%${q}%`,
                })
                .getMany();
        }
        return this.accountRepository.find();
    }


    /**
     * 
     * @returns {Promise<Account[]>} Accounts Array
     * 
     * Consideration: Querying feature
     */
    async getByRole(accountRole: AccountRoles) : Promise<Account[]> {
        return this.accountRepository.find({
            where: {
                roles: ArrayContains([accountRole])
            }
        })
    }

    /**
     * 
     * @param {id} Account ID
     * @returns {Promise<Acount>} Account Entity
     */
    async getByIdOrFail(id : string) : Promise<Account> {
        return this.accountRepository.findOneOrFail({
            where: { id },
            relations: {
              team: true,
            },
          });
    }

    /**
     * 
     * @param {ids} Account IDs as a string array 
     * @returns {Promise<Account[]>} Accounts Array
     */
    async getByIds(ids: string[]): Promise<Account[]> {
        return this.accountRepository.findBy({
            id: In(ids)
        })
    }

    /**
     * 
     * @param {createAccountDto} Account Creation DTO
     * @returns {Promise<Account>} Account Entity
     */
    async create(createAccountDTO: RequestAccountDTO) : Promise<Account> {
        const { password, ...accountDTO } = createAccountDTO;
        const accountFromAuth = await this.supabaseService
        .getClient()
        .auth
        .signUp({ 
            email: accountDTO.email, 
            password, 
            options: { 
                emailRedirectTo: this.configService.get('SITE_URL') + createAccountDTO.redirectTo,
            } 
        })
        

        const account: Account = await this.accountRepository.save({
            id: accountFromAuth.data.user.id,
            email: createAccountDTO.email,
            firstName: createAccountDTO.firstName,
            lastName: createAccountDTO.lastName,
            roles: [AccountRoles.USER],
            createdAt: (new Date()).toISOString()
        });

        this.logger.info({ msg: 'Creating account', account });
        await this.accountProducer.addCreatedAccountToAccountQueue(account);
        return account;
    }

    /**
     * 
     * @param {createAccountDto} Account Creation DTO
     * @returns {Promise<Account>} Account Entity
     */
    async createAccountThroughInviteLink(createAccountDTO: RequestAccountDTO) : Promise<Account> {
        const accountFromAuth = await this.supabaseService
            .getClient()
            .auth
            .admin
            .inviteUserByEmail(createAccountDTO.email, { redirectTo: this.configService.get('SITE_URL') + '/onboard' })

        const account: Account = await this.accountRepository.save({
            ...createAccountDTO,
            id: accountFromAuth.data.user.id,
            firstName: this.capitalizeFirstLetter(createAccountDTO.firstName),
            lastName: this.capitalizeFirstLetter(createAccountDTO.lastName),
            createdAt: (new Date()).toISOString()
        });

        this.logger.info({ msg: 'Creating account with invite link', account });
        await this.accountProducer.addCreatedAccountToAccountQueue(account);
        return account;
    }

 
    /**
     * 
     * @param {id} Account ID
     * @param {updateAccountDTO} Account Update DTO
     * @returns {Promise<Account>} Account Entity
     */
    async update(id: string, updateAccountDTO: RequestAccountDTO | Account) :Promise<Account> {
        // get account
        const account: Account = await this.getByIdOrFail(id);
        
        // TODO: Create a global exception handler
        // if account is not found
        if (!account) {
            // throw error
            throw new Error('Account not found with ID: ' + id);
        }

        account.email = updateAccountDTO.email;
        account.roles = updateAccountDTO.roles,
        account.firstName = this.capitalizeFirstLetter(updateAccountDTO.firstName);
        account.lastName = this.capitalizeFirstLetter(updateAccountDTO.lastName);

        this.logger.info({ msg: 'Updating account', account });

        return this.accountRepository.save(account);
    }
    
    /**
     * 
     * @param {id} Account ID 
     */
    async delete(id: string) : Promise<void> {
        this.logger.info({ msg: 'Deleting account with id:' + id  });
        const account: Account = await this.getByIdOrFail(id);

        this.accountRepository.delete(id);
        this.supabaseService.getClient().auth.admin.deleteUser(id)
        this.accountProducer.addDeletedAccountToAccountQueue(account)
    }
}
