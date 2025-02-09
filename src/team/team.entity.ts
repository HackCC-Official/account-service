import { Account } from "src/account/account.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Team {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Account, (account) => account.team) 
  accounts: Account[];

  @Column()
  //Is actually a timestampz
  createdAt: string;
}