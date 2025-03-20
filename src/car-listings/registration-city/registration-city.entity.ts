// src/location/entities/registration-city.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CarListing } from '../car-listing.entity';

@Entity('registration_cities')
export class RegistrationCity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  name: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relations
  @OneToMany(() => CarListing, carListing => carListing.registrationCity)
  carListings: CarListing[];
}