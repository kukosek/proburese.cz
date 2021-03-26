import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import {Min, Max} from "class-validator"
import {
	ObjectType, Field, ID
} from 'type-graphql';

@ObjectType()
@Entity()
export class Donate extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: Number;

	@Field()
	@Column()
	bankId!: string;

	@Field()
	@Column()
	account!: string;

	@Field()
	@Column()
	author!: string;

	@Field()
	@Column()
	authorId!: number

	@Field()
	@Column({type: 'real'})
	amount!: string;

	@Field()
	@Column()
	message!: string;

	@Field()
	@Column()
	date!: Date;

	@Field()
	@Column()
	score: Number = 0;

	@Field()
	@Column()
	duplicate: boolean = false;

	@Field()
	@Min(-2)
	@Max(1)
	userScore: Number = 0
}
