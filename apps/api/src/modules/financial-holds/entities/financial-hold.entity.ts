import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('financial_holds')
export class FinancialHold {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id', unique: true })
  studentId: number;

  @Column({ length: 255 })
  reason: string;

  @Column({ default: true })
  active: boolean;

  @Column({ name: 'created_by' })
  createdBy: number;

  @Column({ name: 'resolved_by', nullable: true })
  resolvedBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'resolved_at', type: 'datetime', nullable: true })
  resolvedAt: Date;
}
