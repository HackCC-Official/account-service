import { Controller, Get, Post, Put, Delete, Param, Req, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { RequestAccountDTO } from './request-account.dto';
import { ResponseAccountDTO } from './response-account.dto';

@Controller('accounts')
export class AccountController {
    constructor(private accountService: AccountService) {};

    @Get()
    async findAll(): Promise<ResponseAccountDTO[]> {
        return await this.accountService.getAll();
    }

    @Get(':account_id')
    async find(@Param('account_id') id: string): Promise<ResponseAccountDTO> {
        return await this.accountService.get(id);
    }

    @Post()
    async create(
        @Body() createAccountDto: RequestAccountDTO
    ): Promise<ResponseAccountDTO> {
        return await this.accountService.create(createAccountDto);
    }

    @Put(':account_id')
    async update(
        @Param('account_id') id: string,
        @Body() updateAccountDto: RequestAccountDTO
    ): Promise<ResponseAccountDTO> {
        return await this.accountService.put(id, updateAccountDto);
    }

    @Delete(':account_id')
    async delete(@Param('account_id') id: string): Promise<void> {
        return await this.accountService.delete(id);
    }
}
