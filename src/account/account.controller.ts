import { Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountDTO } from './account.entity';

@Controller('account')
export class AccountController {
    constructor(private accServ: AccountService) { };
    //Notes: database calls are usually asynchronus~

    //Create
    /*
     * TODO:
     * get request body
     * */ 
    @Post()
    async create(): Promise<void> {
        return this.accServ.create();
    }

    //Read
    @Get()
    async findAll(): Promise<AccountDTO[]> {
        return await this.accServ.getall();
    }
    @Get(':id')
    async find(@Param() params: any): Promise<AccountDTO> {
        return await this.accServ.get(params.id);
    }

    //Update
    /*
     * TODO:
     * get request body for updateAll()
     * */ 
    @Put()
    async updateAll(): Promise<string[]> {
        return await this.accServ.put();
    }
    @Put(':id')
    async update(): Promise<string[]> {
        return await this.accServ.patch();
    }

    //Delete
    @Delete(':id')
    async delete(): Promise<void> {
        return await this.accServ.delete();
    }
}
