// src/user/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CarListing } from 'src/car-listings/car-listing.entity';
import { InspectionRequest } from 'src/inspection-request/entity/inspection-request.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password_hash: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  first_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  last_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;

  @Column({ type: 'text', nullable: true })
  profile_picture_url: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relations
  @OneToMany(() => CarListing, carListing => carListing.user)
  listings: CarListing[];

  @OneToMany(() => InspectionRequest, inspectionRequest => inspectionRequest.user)
  inspectionRequests: InspectionRequest[];
  

}