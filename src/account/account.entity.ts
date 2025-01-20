import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Account {
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

    loggedInAt: string[];
}
