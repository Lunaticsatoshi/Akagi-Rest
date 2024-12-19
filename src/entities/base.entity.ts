// base.entity.ts
import { instanceToPlain } from 'class-transformer'
import {
  BaseEntity as TypeormBaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { uuid } from 'uuidv4'

export default abstract class BaseEntity extends TypeormBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'uuid', unique: true })
  @Index()
  entityId: string

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @Column({ type: 'boolean', default: false })
  isArchived: boolean

  @Column({ type: 'varchar', length: 300, default: 'system' })
  createdBy: string

  @Column({ type: 'varchar', length: 300, default: 'system' })
  lastChangedBy: string

  @Column({ type: 'varchar', length: 300, nullable: true })
  internalComment: string | null

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date

  @BeforeInsert()
  generateId() {
    this.entityId = uuid()
  }

  toJSON() {
    return instanceToPlain(this)
  }
}
