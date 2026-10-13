import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  code: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'department_id', nullable: true })
  departmentId: number;

  @Column({ name: 'credit_hours', default: 3 })
  creditHours: number;

  @Column({ name: 'prerequisite_course_id', nullable: true })
  prerequisiteCourseId: number;

  @Column({ default: 1 })
  level: number;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}