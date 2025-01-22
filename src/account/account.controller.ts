import { Controller, Get, Post, Put, Delete, Param, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { RequestAccountDTO } from './request-account.dto';
import { ResponseAccountDTO } from './response-account.dto';

@Controller('account')
export class AccountController {
    constructor(private accountService: AccountService) {};

    @Get()
    async findAll(): Promise<ResponseAccountDTO[]> {
        return await this.accountService.getAll();
    }

    @Get(':id')
    async find(@Param('id') id: string): Promise<ResponseAccountDTO> {
        return await this.accountService.get(id);
    }

    @Post()
    async create(
        @Req() createAccountDto: RequestAccountDTO
    ): Promise<ResponseAccountDTO> {
        return await this.accountService.create(createAccountDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Req() updateAccountDto: RequestAccountDTO
    ): Promise<ResponseAccountDTO> {
        return await this.accountService.put(id, updateAccountDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return await this.accountService.delete(id);
    }
}
