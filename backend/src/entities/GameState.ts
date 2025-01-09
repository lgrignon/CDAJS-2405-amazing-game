import { BaseEntity, BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";

@Entity()
export class GameState extends BaseEntity {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    clientId: string;

    @Column()
    state: string;

    @Column({ nullable: true })
    createdAt?: Date;

    constructor(
        clientId: string = '',
        state: string = ''
    ) {
        super();

        this.clientId = clientId;
        this.state = state;
    }

    @BeforeInsert()
    onBeforeInsert() {
        console.log("before insert - " + this.clientId)
        if (!this.createdAt) {
            this.createdAt = new Date();
        }
    }
}