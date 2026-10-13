import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true })
  userId: number;

  @Column({ name: 'student_code', unique: true, length: 30 })
  studentCode: string;

  @Column({ name: 'department_id', nullable: true })
  departmentId: number;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
  gender: 'male' | 'female' | 'other';

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ name: 'guardian_name', length: 150, nullable: true })
  guardianName: string;

  @Column({ name: 'guardian_phone', length: 30, nullable: true })
  guardianPhone: string;

  @Column({ name: 'admission_date', type: 'date', nullable: true })
  admissionDate: Date;

  @Column({ name: 'current_semester', default: 1 })
  currentSemester: number;

  @Column({ type: 'enum', enum: ['active', 'graduated', 'withdrawn', 'suspended'], default: 'active' })
  status: 'active' | 'graduated' | 'withdrawn' | 'suspended';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}