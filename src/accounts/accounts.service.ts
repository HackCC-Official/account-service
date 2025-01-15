import { Injectable } from '@nestjs/common';
import { Accounts } from './interface/accounts.interface';


@Injectable()
export class AccountsService {
    create(accounts: Accounts[]) : string {
        return 'account created';
    }
    read(users: string[]) : string {
        return 'account details';
    }
    readAll() : string {
        return 'all account details';
    }
    update(account: Accounts[]) : string {
        return 'account updated';
    }
    updateAll() : string {
        return 'accounts updated';
    }
    delete(users: string[]) : string {
        return 'deleted account';
    }
}
