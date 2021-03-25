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

	@Field({nullable: true})
	@Column()
	profileId: string = ""

	@Field({nullable: true})
	@Column()
	displayName: String = ""
}
