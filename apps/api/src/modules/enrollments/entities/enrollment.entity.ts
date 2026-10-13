import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id' })
  studentId: number;

  @Column({ name: 'course_section_id' })
  courseSectionId: number;

  @Column({ name: 'semester_id' })
  semesterId: number;

  @CreateDateColumn({ name: 'enrolled_at' })
  enrolledAt: Date;

  @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected', 'dropped', 'completed'], default: 'pending' })
  status: 'pending' | 'approved' | 'rejected' | 'dropped' | 'completed';

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: number;

  @Column({ name: 'approved_at', type: 'datetime', nullable: true })
  approvedAt: Date;
}