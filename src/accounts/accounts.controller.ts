import { Controller, Get, Post, Delete, Patch } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
    constructor(private AccountsService: AccountsService) {}
    @Post()
    async create() {
        this.AccountsService.create();
    }
    @Get('all')
    async readAll() {
        this.AccountsService.readAll();
    }
    @Get(':id')
    async read() {
        this.AccountsService.read();
    }
    @Patch('all')
    async updateAll() {
        this.AccountsService.updateAll();
    }
    @Patch(':id')
    async update() {
        this.AccountsService.update();
    }
    @Delete(':id')
    async delete() {
        this.AccountsService.delete();
    }
}
