import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { CarListing } from '../car-listing.entity';

@Entity('car_additional_details')
export class CarAdditionalDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  engine_type: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  engine_capacity: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  transmission: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  assembly: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fuel_type: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToOne(() => CarListing, listing => listing.additionalDetail, { nullable: false })
  @JoinColumn({ name: 'listing_id' })
  listing: CarListing;
}