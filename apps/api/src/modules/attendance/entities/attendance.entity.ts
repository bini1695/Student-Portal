import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'course_section_id' })
  courseSectionId: number;

  @Column({ name: 'student_id' })
  studentId: number;

  @Column({ name: 'attendance_date', type: 'date' })
  attendanceDate: Date;

  @Column({ type: 'enum', enum: ['present', 'absent', 'late', 'excused'] })
  status: 'present' | 'absent' | 'late' | 'excused';

  @Column({ length: 255, nullable: true })
  remarks: string;

  @Column({ name: 'marked_by', nullable: true })
  markedBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}