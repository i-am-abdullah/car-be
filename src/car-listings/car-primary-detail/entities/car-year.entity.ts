import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index, JoinColumn } from 'typeorm';
import { CarMake } from './car-make.entity';
import { CarModel } from './car-model.entity';
import { CarVariant } from './car-variant.entity';
import { CarListing } from '../../car-listing.entity';

@Entity('car_year')
export class CarYear {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer', nullable: false })
  year: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;


  @ManyToOne(() => CarModel, model => model.years, { nullable: false })
  @JoinColumn({ name: 'model_id' })
  model: CarModel;

  @ManyToOne(() => CarMake, make => make.years, { nullable: false })
  @JoinColumn({ name: 'make_id' })
  make: CarMake;

  @OneToMany(() => CarVariant, variant => variant.year)
  variants: CarVariant[];

  @OneToMany(() => CarListing, listing => listing.year)
  listings: CarListing[];
}