import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('course_sections')
export class CourseSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @Column({ name: 'semester_id' })
  semesterId: number;

  @Column({ name: 'teacher_id', nullable: true })
  teacherId: number;

  @Column({ name: 'section_name', length: 10 })
  sectionName: string;

  @Column({ length: 50, nullable: true })
  room: string;

  @Column({ name: 'day_of_week', type: 'enum', enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], nullable: true })
  dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

  @Column({ name: 'start_time', type: 'time', nullable: true })
  startTime: string;

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime: string;

  @Column({ default: 40 })
  capacity: number;

  @Column({ name: 'enrolled_count', default: 0 })
  enrolledCount: number;

  @Column({ type: 'enum', enum: ['open', 'closed', 'cancelled'], default: 'open' })
  status: 'open' | 'closed' | 'cancelled';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}