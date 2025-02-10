import { Team } from "src/team/team.entity";
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne } from "typeorm";

@Entity()
export class Account {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    //Is actually a jsonb
    roles: string;

    @Column()
    //Is actually a timestampz
    createdAt: string;

    // Add this column to your entity!
    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToOne(() => Team, (team) => team.accounts, { nullable: true, onDelete: "SET NULL" })
    team: Team;
}
