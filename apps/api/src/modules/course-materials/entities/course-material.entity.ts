import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('course_materials')
export class CourseMaterial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'course_section_id' })
  courseSectionId: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @Column({ name: 'file_type', length: 50, nullable: true })
  fileType: string;

  @Column({ name: 'uploaded_by' })
  uploadedBy: number;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;
}