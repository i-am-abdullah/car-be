import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn} from 'typeorm';
import { CarMake } from './car-primary-detail/entities/car-make.entity';
import { CarModel } from './car-primary-detail/entities/car-model.entity';
import { CarYear } from './car-primary-detail/entities/car-year.entity';
import { CarVariant } from './car-primary-detail/entities/car-variant.entity';
import { User } from 'src/users/entities/user.entity';
import { RegistrationCity } from './registration-city/registration-city.entity';
import { CarAdditionalDetail } from './car-additional-detail/car-additional-detail.entity';
import { CarGeneralDetail } from './car-general-detail/car-general-detail.entity';
import { CarListingFeature } from './car-listing-feature/car-listing-feature.entity';
import { CarListingImage } from './car-listing-image/car-listing-image.entity';
import { InspectionRequest } from 'src/inspection-request/entity/inspection-request.entity';
import { Conversation } from 'src/chat/entities/conversation.entity';

@Entity('car_listings')
export class CarListing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['draft', 'pending', 'active', 'sold', 'inactive', 'rejected'], default: 'draft' })
  status: 'draft' | 'pending' | 'active' | 'sold' | 'inactive' | 'rejected';

  @Column({ type: 'integer', nullable: false })
  meter_reading: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  color: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  location: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  listing_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  featured_until: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => User, user => user.listings, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => CarVariant, variant => variant.listings, { nullable: false })
  @JoinColumn({ name: 'variant_id' })
  variant: CarVariant;

  @ManyToOne(() => CarMake, make => make.listings, { nullable: false })
  @JoinColumn({ name: 'make_id' })
  make: CarMake;

  @ManyToOne(() => CarModel, model => model.listings, { nullable: false })
  @JoinColumn({ name: 'model_id' })
  model: CarModel;

  @ManyToOne(() => CarYear, year => year.listings, { nullable: false })
  @JoinColumn({ name: 'year_id' })
  year: CarYear;

  @ManyToOne(() => RegistrationCity, registrationCity => registrationCity.carListings, { nullable: false })
  @JoinColumn({ name: 'registration_city_id' })
  registrationCity: RegistrationCity;

  @OneToOne(() => CarAdditionalDetail, additionalDetail => additionalDetail.listing, { nullable: true })
  @JoinColumn({ name: 'additional_detail_id' })
  additionalDetail: CarAdditionalDetail;

  @OneToOne(() => CarGeneralDetail, generalDetail => generalDetail.listing, { nullable: true })
  @JoinColumn({ name: 'general_detail_id' })
  generalDetail: CarGeneralDetail;

  @OneToMany(() => CarListingFeature, listingFeature => listingFeature.listing)
  features: CarListingFeature[];

  @OneToMany(() => CarListingImage, listingImage => listingImage.listing)
  images: CarListingImage[];

  @OneToMany(() => InspectionRequest, inspecitonRequest => inspecitonRequest.listing)
  inspectionRequests: InspectionRequest[];

  @OneToMany(() => Conversation, conversation => conversation.listing)
  conversation: InspectionRequest[];

}