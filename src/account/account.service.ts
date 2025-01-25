import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Account } from './account.entity';
import { RequestAccountDTO } from './request-account.dto';
import { ResponseAccountDTO } from './response-account.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AccountProducerService } from 'src/account-queue/account-producer.provider';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
        @InjectPinoLogger(AccountService.name)
        private readonly logger: PinoLogger,
        private readonly accountProducer: AccountProducerService
    ) {}

    /**
     * 
     * @param {createAccountDto} Account Creation DTO
     * @returns {Promise<Account>} Account Entity
     */
    async create(createAccountDto: RequestAccountDTO) : Promise<Account> {
        const account: Account = await this.accountRepository.save({
            ...createAccountDto,
            createdAt: (new Date()).toISOString()
        });
        this.logger.info({ msg: 'Creating account', account });
        await this.accountProducer.addCreatedAccountToAccountQueue(account);
        return account;
    }

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
    async get(id : string) : Promise<Account> {
        return this.accountRepository.findOneBy({ id });
    }

    /**
     * 
     * @param {id} Account ID
     * @param {updateAccountDto} Account Update DTO
     * @returns {Promise<Account>} Account Entity
     */
    async put(id: string, updateAccountDto: RequestAccountDTO) :Promise<Account> {
        // get account
        const account: Account = await this.get(id);
        
        // TODO: Create a global exception handler
        // if account is not found
        if (!account) {
            // throw error
            throw new Error('Account not found with ID: ' + id);
        }

        account.email = updateAccountDto.email;
        account.password = updateAccountDto.password;
        account.roles = updateAccountDto.roles;

        this.logger.info({ msg: 'Updating account', account });

        return this.accountRepository.save(account);
    }
    
    async delete(id: string) : Promise<void> {
        this.logger.info({ msg: 'Deleting account with id:' + id  });
        this.accountRepository.softDelete(id);
    }
}
