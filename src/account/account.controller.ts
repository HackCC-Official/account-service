import { Controller, Get, Post, Put, Delete, Param, Req, Body, Query, ValidationPipe, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { RequestAccountDTO } from './request-account.dto';
import { ResponseAccountDTO } from './response-account.dto';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AccountRoles } from './role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';

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

    @Get('/protected')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.USER])
    async protected(@Req() req) {
      return {
        "message": "AuthGuard works 🎉",
        "authenticated_user": req.user
      };
    }

    @Get()
    @ApiOperation({
        summary: 'Finds all Accounts'
    })
    @ApiQuery({
        required: false,
        name: 'account_ids',
        description: 'Given a list of account_ids, it will batch fetch the accounts'
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    async find(@Param('account_id') id: string): Promise<ResponseAccountDTO> {
        return await this.accountService.getByIdOrFail(id);
    }

    @Post()
    @ApiOperation({
        summary: 'Creates an Account for a hacker/organizer/judge/etc AND sends a message to all queues that listen for account creation'
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    async create(
        @Body() createAccountDTO: RequestAccountDTO
    ): Promise<ResponseAccountDTO> {
        return await this.accountService.create(createAccountDTO);
    }

    @Post('/invite-link')
    @ApiOperation({
        summary: 'Creates an Account using an invite link'
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    async createWithInviteLink(
        @Body() createAccountDTO: RequestAccountDTO
    ): Promise<ResponseAccountDTO> {
        return await this.accountService.createAccountThroughInviteLink(createAccountDTO)
    }

    @Put(':account_id')
    @ApiOperation({
        summary: 'Updates an existing Account AND sends a message to all queues that listen for account update'
    })
    @ApiParam({
        description: 'ID of an existing account',
        name: 'account_id'
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    async update(
        @Param('account_id') id: string,
        @Body() updateAccountDTO: RequestAccountDTO
    ): Promise<ResponseAccountDTO> {
        return await this.accountService.update(id, updateAccountDTO);
    }

    @Delete(':account_id')
    @ApiOperation({
        summary: 'Deletes an existing Account AND sends a message to all queues that listen for account deletion'
    })
    @ApiParam({
        description: 'ID of an existing account',
        name: 'account_id'
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    async delete(@Param('account_id') id: string): Promise<void> {
        return await this.accountService.delete(id);
    }
}
