import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { CarListing } from '../car-listing.entity';

@Entity('car_general_details')
export class CarGeneralDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  reason_for_selling: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ownership_status: string;

  @Column({ type: 'boolean', default: false })
  accident_history: boolean;

  @Column({ type: 'integer', nullable: true })
  registration_year: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  registration_number: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToOne(() => CarListing, listing => listing.generalDetail, { nullable: false })
  @JoinColumn({ name: 'listing_id' })
  listing: CarListing;
}