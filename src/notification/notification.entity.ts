import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Account } from "src/account/account.entity";
import { Team } from "src/team/team.entity";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Account, { nullable: false, onDelete: 'CASCADE' })
    account: Account;

    @ManyToOne(() => Team, { nullable: false })
    team: Team;

    @Column()
    createdAt: string;
}

