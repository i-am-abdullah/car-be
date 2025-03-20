// src/car/entities/car-variant.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, Index, JoinColumn } from 'typeorm';
import { CarMake } from './car-make.entity';
import { CarModel } from './car-model.entity';
import { CarYear } from './car-year.entity';
import { ShowroomDetail } from '../../showroom-detail/showroom-detail.entity';
import { CarListing } from '../../car-listing.entity';

@Entity('car_variant')
export class CarVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relations
  @ManyToOne(() => CarModel, model => model.variants, { nullable: false })
  @JoinColumn({ name: 'model_id' })
  model: CarModel;

  @ManyToOne(() => CarMake, make => make.variants, { nullable: false })
  @JoinColumn({ name: 'make_id' })
  make: CarMake;

  @ManyToOne(() => CarYear, year => year.variants, { nullable: false })
  @JoinColumn({ name: 'year_id' })
  year: CarYear;

  @OneToOne(() => ShowroomDetail, showroomDetail => showroomDetail.variant)
  @JoinColumn({ name: 'showroom_detail' })
  showroomDetail: ShowroomDetail;

  @OneToMany(() => CarListing, listing => listing.variant)
  listings: CarListing[];
}