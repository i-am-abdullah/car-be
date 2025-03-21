import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn} from 'typeorm';
import { CarListing } from '../car-listing.entity';
import { Features } from '../features/feature.entity';

@Entity('car_listing_features')
export class CarListingFeature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => CarListing, listing => listing.features, { nullable: false })
  @JoinColumn({ name: 'listing_id' })
  listing: CarListing;

  @ManyToOne(() => Features, feature => feature.listingFeatures, { nullable: false })
  @JoinColumn({ name: 'feature_id' })
  feature: Features;
}