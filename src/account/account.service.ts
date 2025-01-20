import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, InsertResult, Repository, UpdateResult } from 'typeorm';
import { AccountDTO } from './account.entity';
import { UpdateAccountDTO } from './account.interface';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(AccountDTO)
        private accRepo: Repository<AccountDTO>,
    ) {}

    //Create
    create(account: AccountDTO) : Promise<InsertResult> {
        return this.accRepo.insert(account);
    }

    //Read
    getAll() : Promise<AccountDTO[]> {
        return this.accRepo.find();
    }
    get(id : string) : Promise<AccountDTO> {
        return this.accRepo.findOneBy({ id });
    }

    //Update
    put(id :string, update: UpdateAccountDTO) :Promise<UpdateResult> {
        return this.accRepo.update(id, update);
    }
    putAll(criteria: FindOptionsWhere<AccountDTO>, update: UpdateAccountDTO): Promise<UpdateResult> {
        return this.accRepo.update(criteria, update);
    }

    //Delete
    delete(ids: string[]) : Promise<UpdateResult> {
        return this.accRepo.softDelete(ids);
    }

    

     
}
