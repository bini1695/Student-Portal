import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('student_requests')
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id' })
  studentId: number;

  @Column({ type: 'enum', enum: ['transcript', 'certificate', 'leave', 'other'] })
  type: 'transcript' | 'certificate' | 'leave' | 'other';

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ name: 'handled_by', nullable: true })
  handledBy: number;

  @Column({ name: 'handled_at', type: 'datetime', nullable: true })
  handledAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}