import { Controller, Get, Post, Put, Delete, Param, Req, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { RequestAccountDTO } from './request-account.dto';
import { ResponseAccountDTO } from './response-account.dto';

@Controller('accounts')
export class AccountController {
    constructor(private accountService: AccountService) {};

    @Get()
    async findAll(): Promise<ResponseAccountDTO[]> {
        console.log("HEY")
        console.log('TEST')
        return await this.accountService.getAll();
    }

    @Get(':id')
    async find(@Param('id') id: string): Promise<ResponseAccountDTO> {
        return await this.accountService.get(id);
    }

    @Post()
    async create(
        @Body() createAccountDto: RequestAccountDTO
    ): Promise<ResponseAccountDTO> {
        return await this.accountService.create(createAccountDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateAccountDto: RequestAccountDTO
    ): Promise<ResponseAccountDTO> {
        return await this.accountService.put(id, updateAccountDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return await this.accountService.delete(id);
    }
}
