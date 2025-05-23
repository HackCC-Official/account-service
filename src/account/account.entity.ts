import { Team } from "src/team/team.entity";
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne } from "typeorm";
import { AccountRoles } from "./role.enum";

@Entity()
export class Account {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column('text', { array: true })
    roles: AccountRoles[];

    @Column()
    //Is actually a timestampz
    createdAt: string;

    // Add this column to your entity!
    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToOne(() => Team, (team) => team.accounts, { nullable: true, onDelete: "SET NULL" })
    team: Team;
}
