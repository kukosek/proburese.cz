import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import {Min, Max} from "class-validator"
import {
	ObjectType, Field, ID
} from 'type-graphql';

@ObjectType()
@Entity()
export class MonthStat extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: Number

	@Field()
	@Column({type: 'date'})
	month!: string

	@Field()
	@Column({type: 'real'})
	amount: string = "0.0";

	@Field()
	@Column({type: 'real'})
	count: number = 0;
}
