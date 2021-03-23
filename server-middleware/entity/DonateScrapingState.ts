
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

import {
	ObjectType, Field, ID
} from 'type-graphql';

@ObjectType()
@Entity()
export class DonateScrapingState extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: Number;

	@Field()
	@Column({unique: true})
	account!: String;

	@Field()
	@Column()
	records: number = 0;

	@Field()
	@Column({type: 'real'})
	income: string = "0.0";

	@Field()
	@Column()
	oneCentsDonateCount: number = 0;
}
