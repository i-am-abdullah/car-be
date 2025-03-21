import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CarModel } from './car-model.entity';
import { CarYear } from './car-year.entity';
import { CarVariant } from './car-variant.entity';
import { CarListing } from '../../car-listing.entity';

@Entity('car_make')
export class CarMake {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  image_url: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => CarModel, model => model.make)
  models: CarModel[];

  @OneToMany(() => CarYear, year => year.make)
  years: CarYear[];

  @OneToMany(() => CarVariant, variant => variant.make)
  variants: CarVariant[];

  @OneToMany(() => CarListing, listing => listing.make)
  listings: CarListing[];
}