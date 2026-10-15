import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'enrollment_id', unique: true })
  enrollmentId: number;

  @Column({ name: 'midterm_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
  midtermScore: number;

  @Column({ name: 'final_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
  finalScore: number;

  @Column({ name: 'assignment_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
  assignmentScore: number;

  @Column({ name: 'total_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
  totalScore: number;

  @Column({ name: 'letter_grade', length: 3, nullable: true })
  letterGrade: string;

  @Column({ name: 'grade_point', type: 'decimal', precision: 3, scale: 2, nullable: true })
  gradePoint: number;

  @Column({
    name: 'approval_status',
    type: 'enum',
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'approved',
  })
  approvalStatus: 'draft' | 'submitted' | 'approved' | 'rejected';

  @Column({ name: 'submitted_at', type: 'datetime', nullable: true })
  submittedAt: Date;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: number;

  @Column({ name: 'approved_at', type: 'datetime', nullable: true })
  approvedAt: Date;

  @Column({ name: 'entered_by', nullable: true })
  enteredBy: number;

  @CreateDateColumn({ name: 'entered_at' })
  enteredAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}