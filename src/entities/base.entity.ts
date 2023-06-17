// base.entity.ts
import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
  BeforeInsert,
  BaseEntity as TypeormBaseEntity,
} from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { Field, ObjectType } from '@nestjs/graphql';
import { uuid } from 'uuidv4';

@ObjectType()
export default abstract class BaseEntity extends TypeormBaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'uuid', unique: true })
  @Index()
  uuid: string;

  @Field()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Field()
  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ type: 'varchar', length: 300, default: 'system' })
  createdBy: string;

  @Column({ type: 'varchar', length: 300, default: 'system' })
  lastChangedBy: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  internalComment: string | null;

  @Field()
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @BeforeInsert()
  generateId() {
    this.uuid = uuid();
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
