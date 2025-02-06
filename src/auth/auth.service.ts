import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class AuthService {
    constructor(
        private accountsService: AccountService,
        private jwtService: JwtService
    ){}

    async signIn(email: string, pass: string): Promise<{ access_token: string }> {
        const account = await this.accountsService.getByEmail(email);
        //TODO: PLEASE SET UP BCRYPT
        compare(pass, account.password, function(err, result) {
            if (!result){
                throw new UnauthorizedException();
            }
        })

        const payload = {sub: account.id, email: account.email}
        return {
            access_token: await this.jwtService.signAsync(payload),
        }
    }
}
