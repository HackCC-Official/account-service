import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Account } from './account.entity';
import { RequestAccountDTO } from './request-account.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AccountProducerService } from 'src/account-producer/account-producer.provider';
import { SupabaseService } from 'src/auth/supabase.service';
import { AccountRoles } from './role.enum';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
        @InjectPinoLogger(AccountService.name)
        private readonly logger: PinoLogger,
        private readonly accountProducer: AccountProducerService,
        private readonly supabaseService: SupabaseService
    ) {}

    /**
     * 
     * @returns {Promise<Account[]>} Accounts Array
     * 
     * Consideration: Querying feature
     */
    async getAll() : Promise<Account[]> {
        return this.accountRepository.find();
    }

    /**
     * 
     * @param {id} Account ID
     * @returns {Promise<Acount>} Account Entity
     */
    async getByIdOrFail(id : string) : Promise<Account> {
        return this.accountRepository.findOneByOrFail({ id });
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
        .auth.signUp({ email: accountDTO.email, password });

        const account: Account = await this.accountRepository.save({
            id: accountFromAuth.data.user.id,
            ...accountDTO,
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
            .inviteUserByEmail(createAccountDTO.email)

        const account: Account = await this.accountRepository.save({
            id: accountFromAuth.data.user.id,
            ...createAccountDTO,
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
    async update(id: string, updateAccountDTO: RequestAccountDTO) :Promise<Account> {
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
        account.firstName = updateAccountDTO.firstName;
        account.lastName = updateAccountDTO.lastName;

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

        this.accountRepository.softDelete(id);
        this.accountProducer.addDeletedAccountToAccountQueue(account)
    }
}
