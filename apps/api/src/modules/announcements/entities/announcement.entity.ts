import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: ['all', 'students', 'teachers', 'admins', 'department', 'course'], default: 'all' })
  audience: 'all' | 'students' | 'teachers' | 'admins' | 'department' | 'course';

  @Column({ name: 'department_id', nullable: true })
  departmentId: number;

  @Column({ name: 'course_section_id', nullable: true })
  courseSectionId: number;

  @Column({ name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'expires_at', type: 'datetime', nullable: true })
  expiresAt: Date;
}