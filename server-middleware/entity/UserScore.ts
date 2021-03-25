import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class UserScore extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: Number

	@Column()
	userId!: Number

	@Column()
	donateId!: Number

	@Column()
	score: Number = 0
}
