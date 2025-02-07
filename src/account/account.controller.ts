import { Controller, Get, Post, Put, Delete, Param, Req, Body, Query, ValidationPipe } from '@nestjs/common';
import { AccountService } from './account.service';
import { RequestAccountDTO } from './request-account.dto';
import { ResponseAccountDTO } from './response-account.dto';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

class AccountQueryParamDTO {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => value.toString().split(','))
    account_ids: string[];
}

@Controller('accounts')
export class AccountController {
    constructor(private accountService: AccountService) {};

    @Get()
    @ApiOperation({
        summary: 'Finds all Accounts'
    })
    @ApiQuery({
        required: false,
        name: 'account_ids',
        description: 'Given a list of account_ids, it will batch fetch the accounts'
    })
    async findAll(
        @Query(new ValidationPipe({ transform: true })) query: AccountQueryParamDTO
    ): Promise<ResponseAccountDTO[]> {
        if (query.account_ids) {
            return await this.accountService.getByIds(query.account_ids);
        }
        return await this.accountService.getAll();
    }

    @Get(':account_id')
    @ApiOperation({
        summary: 'Finds an Account by account_id'
    })
    @ApiParam({
        description: 'ID of an existing account',
        name: 'account_id'
    })
    async find(@Param('account_id') id: string): Promise<ResponseAccountDTO> {
        return await this.accountService.get(id);
    }

    @Post()
    @ApiOperation({
        summary: 'Creates an Account for a hacker/organizer/judge/etc AND sends a message to all queues that listen for account creation'
    })
    async create(
        @Body() createAccountDto: RequestAccountDTO
    ): Promise<ResponseAccountDTO> {
        return await this.accountService.create(createAccountDto);
    }

    @Put(':account_id')
    @ApiOperation({
        summary: 'Updates an existing Account AND sends a message to all queues that listen for account update'
    })
    @ApiParam({
        description: 'ID of an existing account',
        name: 'account_id'
    })
    async update(
        @Param('account_id') id: string,
        @Body() updateAccountDto: RequestAccountDTO
    ): Promise<ResponseAccountDTO> {
        return await this.accountService.put(id, updateAccountDto);
    }

    @Delete(':account_id')
    @ApiOperation({
        summary: 'Deletes an existing Account AND sends a message to all queues that listen for account deletion'
    })
    @ApiParam({
        description: 'ID of an existing account',
        name: 'account_id'
    })
    async delete(@Param('account_id') id: string): Promise<void> {
        return await this.accountService.delete(id);
    }
}
