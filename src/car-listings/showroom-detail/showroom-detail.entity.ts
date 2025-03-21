import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { CarMake } from '../car-primary-detail/entities/car-make.entity';
import { CarModel } from '../car-primary-detail/entities/car-model.entity';
import { CarYear } from '../car-primary-detail/entities/car-year.entity';
import { CarVariant } from '../car-primary-detail/entities/car-variant.entity';

@Entity('showroom_details')
export class ShowroomDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  original_price: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  engine_type: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  engine_capacity: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  transmission: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  assembly: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fuel_type: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  body_type: string;

  @Column({ type: 'integer', nullable: true })
  seating_capacity: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fuel_tank_capacity: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  top_speed: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  acceleration: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  horsepower: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => CarModel, model => model, { nullable: false })
  @JoinColumn({ name: 'model_id' })
  model: CarModel;

  @ManyToOne(() => CarMake, make => make, { nullable: false })
  @JoinColumn({ name: 'make_id' })
  make: CarMake;

  @ManyToOne(() => CarYear, year => year, { nullable: false })
  @JoinColumn({ name: 'year_id' })
  year: CarYear;

  @OneToOne(() => CarVariant, variant => variant.showroomDetail, { nullable: false })
  variant: CarVariant;
}