import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany,Index, JoinColumn } from 'typeorm';
import { CarMake } from './car-make.entity';
import { CarYear } from './car-year.entity';
import { CarVariant } from './car-variant.entity';
import { CarListing } from '../../car-listing.entity';

@Entity('car_model')
export class CarModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  image_url: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => CarMake, make => make.models, { nullable: false })
  @JoinColumn({ name: 'make_id' })
  make: CarMake;

  @OneToMany(() => CarYear, year => year.model)
  years: CarYear[];

  @OneToMany(() => CarVariant, variant => variant.model)
  variants: CarVariant[];

  @OneToMany(() => CarListing, listing => listing.model)
  listings: CarListing[];
}