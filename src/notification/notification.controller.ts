import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { ApiOperation, ApiParam } from "@nestjs/swagger";
import { ResponseNotificationDTO } from "./response-notification.dto";
import { RequestNotificationDTO } from "./request-notification.dto";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { AccountRoles } from "src/account/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { AuthRequest } from "src/auth/auth-request";

@Controller('notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    @Post()
    @ApiOperation({
        summary: 'Creates a new notification for the invited user'
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    async create(
        @Body() requestNotificationDTO: RequestNotificationDTO
    ): Promise<ResponseNotificationDTO> {
        const notificationExists = await this.notificationService.getByAccountIdAndTeamId(
            requestNotificationDTO.accountId,
            requestNotificationDTO.teamId
        )

        if (notificationExists) {
            return notificationExists;
        }

        const notification = await this.notificationService.create(
            requestNotificationDTO.accountId,
            requestNotificationDTO.teamId
        );
        
        const { team: accountTeam, ...account } = notification.account as any;
        
        return {
            id: notification.id,
            team: notification.team as any,
            account: account as any
        };
    }

    @Get()
    @ApiOperation({
        summary: 'Returns a list of notifications for the current user'
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    async findAll(@Req() req: AuthRequest): Promise<ResponseNotificationDTO[]> {
        const notifications = await this.notificationService.getAllForUser(req.user.sub);
        return notifications.map(notification => {
            const { team: accountTeam, ...account } = notification.account as any;
            
            return {
                id: notification.id,
                team: notification.team as any,
                account: account as any
            };
        });
    }

    @Post(':id/accept')
    @ApiOperation({
        summary: 'Accepts a notification invite and adds the user to the team'
    })
    @ApiParam({
        description: 'ID of the notification',
        name: 'id'
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    async accept(
        @Param('id') id: string,
        @Req() req: AuthRequest
    ): Promise<ResponseNotificationDTO> {
        const result = await this.notificationService.accept(id, req.user.sub);
        
        // Circular reference fix
        const team = {
            ...result.team,
            accounts: result.team.accounts?.map((account: any) => {
                const { team, ...accountWithoutTeam } = account;
                return accountWithoutTeam;
            }) || []
        };
        
        const { team: accountTeam, ...account } = result.account as any;
        
        return {
            id: id,
            team: team as any,
            account: account as any
        };
    }

    @Post(':id/deny')
    @ApiOperation({
        summary: 'Denies a notification invite and adds the user to the team'
    })
    @ApiParam({
        description: 'ID of the notification',
        name: 'id'
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    async deny(
        @Param('id') id: string,
        @Req() req: AuthRequest
    ) {
        const result = await this.notificationService.deny(id, req.user.sub);
        return {
            status: 'deleted'
        }
    }
}
