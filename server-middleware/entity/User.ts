import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import {
	ObjectType, Field, ID
} from 'type-graphql';

@ObjectType()
@Entity()
export class BuresUser extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id: Number = 0

	@Column()
	provider!: string;

	@Field({nullable: true})
	@Column()
	profileId: string = ""

	@Field({nullable: true})
	@Column()
	displayName: string = ""

	@Field({nullable: true})
	@Column()
	normalizedName: string = ""

	@Field({nullable: true})
	@Column({nullable: true})
	donatorId!: number
}
