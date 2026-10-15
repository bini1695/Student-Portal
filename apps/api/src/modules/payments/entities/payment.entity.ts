import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'invoice_id' })
  invoiceId: number;

  @Column({ name: 'student_id' })
  studentId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['cash', 'bank_transfer', 'card', 'online', 'mobile_money'] })
  method: 'cash' | 'bank_transfer' | 'card' | 'online' | 'mobile_money';

  @Column({ name: 'reference_no', length: 100, nullable: true })
  referenceNo: string;

  @CreateDateColumn({ name: 'payment_date' })
  paymentDate: Date;

  @Column({ name: 'received_by', nullable: true })
  receivedBy: number;

  @Column({ length: 255, nullable: true })
  notes: string;

  @Column({
    name: 'verification_status',
    type: 'enum',
    enum: ['pending', 'verified', 'rejected'],
    default: 'verified',
  })
  verificationStatus: 'pending' | 'verified' | 'rejected';

  @Column({ name: 'verified_by', nullable: true })
  verifiedBy: number;

  @Column({ name: 'verified_at', type: 'datetime', nullable: true })
  verifiedAt: Date;
}