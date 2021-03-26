import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import {Min} from "class-validator"
import {
	ObjectType, Field, ID
} from 'type-graphql';

@ObjectType()
@Entity()
export class Donator extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number;

	@Field()
	@Column()
	name!: string;

	@Field()
	@Column()
	normalizedName!: string;


	@Field()
	@Column({type: 'real'})
	@Min(0)
	amountDonated: string = "0"

	@Field()
	@Column()
	@Min(0)
	donationCount: number = 0

	@Field()
	@Column()
	score: number = 0
}
