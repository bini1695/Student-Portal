import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'course_section_id' })
  courseSectionId: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'due_date', type: 'datetime' })
  dueDate: Date;

  @Column({ name: 'max_score', type: 'decimal', precision: 6, scale: 2 })
  maxScore: number;

  @Column({ name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}