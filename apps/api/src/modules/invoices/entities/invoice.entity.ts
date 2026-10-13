import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'invoice_number', unique: true, length: 50 })
  invoiceNumber: string;

  @Column({ name: 'student_id' })
  studentId: number;

  @Column({ name: 'fee_structure_id', nullable: true })
  feeStructureId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ name: 'total_due', type: 'decimal', precision: 10, scale: 2 })
  totalDue: number;

  @Column({ name: 'amount_paid', type: 'decimal', precision: 10, scale: 2, default: 0 })
  amountPaid: number;

  @Column({ type: 'enum', enum: ['unpaid', 'partial', 'paid', 'overdue', 'cancelled'], default: 'unpaid' })
  status: 'unpaid' | 'partial' | 'paid' | 'overdue' | 'cancelled';

  @Column({ name: 'issued_date', type: 'date' })
  issuedDate: Date;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}