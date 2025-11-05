import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notification } from "./notification.entity";
import { Repository, EntityNotFoundError } from "typeorm";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { AccountService } from "src/account/account.service";
import { TeamService } from "src/team/team.service";
import { RequestTeamDTO } from "src/team/request-team.dto";

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
        private accountService: AccountService,
        private teamService: TeamService,
        @InjectPinoLogger(NotificationService.name)
        private readonly logger: PinoLogger
    ) {}

    /**
     * Creates a new notification for the invited user
     * @param accountId The ID of the account being invited
     * @param teamId The ID of the team to invite the user to
     * @returns {Promise<Notification>} Notification Entity
     */
    async create(accountId: string, teamId: string): Promise<Notification> {
        const account = await this.accountService.getByIdOrFail(accountId);
        const team = await this.teamService.getByIdOrFail(teamId);

        const notification = await this.notificationRepository.save({
            account,
            team,
            createdAt: (new Date()).toISOString()
        });

        const notificationWithRelations = await this.notificationRepository.findOneOrFail({
            where: { id: notification.id },
            relations: { 
                account: true, 
                team: { accounts: true } 
            }
        });

        this.logger.info({ msg: 'Creating notification', notification: notificationWithRelations });
        return notificationWithRelations;
    }

    /**
     * Gets all notifications for a specific user
     * @param accountId The ID of the account
     * @returns {Promise<Notification[]>} Notifications Array
     */
    async getAllForUser(accountId: string): Promise<Notification[]> {
        return this.notificationRepository.find({
            where: { account: { id: accountId } },
            relations: { 
                team: { accounts: true }, 
                account: true 
            }
        });
    }

    /**
     * Accepts a notification invite and adds the user to the team
     * @param notificationId The ID of the notification
     * @param accountId The ID of the account accepting the invite
     * @returns {Promise<{ team: Team, account: Account }>} Team and Account objects
     */
    async accept(notificationId: string, accountId: string): Promise<{ team: any, account: any }> {
        let notification: Notification;
        
        try {
            notification = await this.notificationRepository.findOneOrFail({
                where: { id: notificationId },
                relations: { account: true, team: true }
            });
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundException(`Notification with id ${notificationId} not found`);
            }
            throw error;
        }

        if (notification.account.id !== accountId) {
            throw new ForbiddenException('Notification does not belong to this user');
        }

        const team = await this.teamService.getByIdOrFail(notification.team.id);
        const existingAccountIds = team.accounts?.map(acc => acc.id) || [];

        // Add the current user to the team
        const accountIdsSet = new Set([...existingAccountIds, accountId]);
        const updateTeamDTO: RequestTeamDTO = {
            name: team.name,
            account_ids: Array.from(accountIdsSet)
        };

        // Update the team
        const updatedTeam = await this.teamService.update(team.id, updateTeamDTO);
        
        // Get the account
        const accountObj = await this.accountService.getByIdOrFail(accountId);

        // Delete the notification after accepting
        await this.notificationRepository.delete(notificationId);

        this.logger.info({ msg: 'Notification accepted', notificationId, accountId, teamId: updatedTeam.id });

        return {
            team: updatedTeam,
            account: accountObj
        };
    }
}
