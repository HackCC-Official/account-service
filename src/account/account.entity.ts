import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AccountDTO {
    @PrimaryGeneratedColumn()
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
    
    @Column()
    //Is actually a timestampz[]
    loggedInAt: string[];
}
