import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('assignment_submissions')
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'assignment_id' })
  assignmentId: number;

  @Column({ name: 'student_id' })
  studentId: number;

  @Column({ name: 'submission_text', type: 'text', nullable: true })
  submissionText: string;

  @Column({ name: 'file_path', length: 500, nullable: true })
  filePath: string;

  @CreateDateColumn({ name: 'submitted_at' })
  submittedAt: Date;

  @Column({ type: 'enum', enum: ['submitted', 'graded'], default: 'submitted' })
  status: 'submitted' | 'graded';

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  score: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @Column({ name: 'graded_by', nullable: true })
  gradedBy: number;

  @Column({ name: 'graded_at', type: 'datetime', nullable: true })
  gradedAt: Date;
}