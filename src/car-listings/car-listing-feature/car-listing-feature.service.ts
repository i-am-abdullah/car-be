import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarListingFeature } from './car-listing-feature.entity';
import { CarListing } from '../car-listing.entity';
import { Features } from '../features/feature.entity';

@Injectable()
export class CarListingFeatureService {
  constructor(
    @InjectRepository(CarListingFeature)
    private carListingFeatureRepository: Repository<CarListingFeature>,
    
    @InjectRepository(CarListing)
    private carListingRepository: Repository<CarListing>,
    
    @InjectRepository(Features)
    private featuresRepository: Repository<Features>,
  ) {}

  /**
   * Add a feature to a car listing
   * @param listingId - ID of the car listing
   * @param featureId - ID of the feature to add
   * @returns The created car listing feature relationship
   */
  async addFeatureToListing(listingId: string, featureId: string): Promise<CarListingFeature> {
    const listing = await this.carListingRepository.findOne({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException(`Car listing with ID ${listingId} not found`);
    }

    const feature = await this.featuresRepository.findOne({
      where: { id: featureId },
    });

    if (!feature) {
      throw new NotFoundException(`Feature with ID ${featureId} not found`);
    }

    const existingFeature = await this.carListingFeatureRepository.findOne({
      where: {
        listing: { id: listingId },
        feature: { id: featureId },
      },
    });

    if (existingFeature) {
      return existingFeature; 
    }

    const newListingFeature = this.carListingFeatureRepository.create({
      listing: listing,
      feature: feature,
    });

    return this.carListingFeatureRepository.save(newListingFeature);
  }

  /**
   * Get all features for a specific car listing
   * @param listingId - ID of the car listing
   * @returns Array of car listing features with feature details
   */
  async getFeaturesByListingId(listingId: string): Promise<CarListingFeature[]> {
    const listing = await this.carListingRepository.findOne({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException(`Car listing with ID ${listingId} not found`);
    }

    return this.carListingFeatureRepository.find({
      where: { listing: { id: listingId } },
      relations: ['feature'],
    });
  }

  /**
   * Delete a feature from a car listing
   * @param listingFeatureId - ID of the listing-feature relationship to remove
   * @returns void
   */
  async deleteFeature(listingFeatureId: string): Promise<void> {
    const listingFeature = await this.carListingFeatureRepository.findOne({
      where: { id: listingFeatureId },
    });

    if (!listingFeature) {
      throw new NotFoundException(`Car listing feature with ID ${listingFeatureId} not found`);
    }

    await this.carListingFeatureRepository.remove(listingFeature);
  }

  /**
   * Delete a specific feature from a car listing
   * @param listingId - ID of the car listing
   * @param featureId - ID of the feature to remove
   * @returns void
   */
  async deleteFeatureFromListing(listingId: string, featureId: string): Promise<void> {
    const listingFeature = await this.carListingFeatureRepository.findOne({
      where: {
        listing: { id: listingId },
        feature: { id: featureId },
      },
    });

    if (!listingFeature) {
      throw new NotFoundException(`Feature with ID ${featureId} not found for listing with ID ${listingId}`);
    }

    await this.carListingFeatureRepository.remove(listingFeature);
  }

  /**
   * Add multiple features to a car listing
   * @param listingId - ID of the car listing
   * @param featureIds - Array of feature IDs to add
   * @returns Array of created car listing feature relationships
   */
  async addMultipleFeaturesToListing(listingId: string, featureIds: string[]): Promise<CarListingFeature[]> {
    const listing = await this.carListingRepository.findOne({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException(`Car listing with ID ${listingId} not found`);
    }

    const results: CarListingFeature[] = [];

    for (const featureId of featureIds) {
      try {
        const feature = await this.featuresRepository.findOne({
          where: { id: featureId },
        });

        if (!feature) {
          console.warn(`Feature with ID ${featureId} not found, skipping`);
          continue;
        }

        const existingFeature = await this.carListingFeatureRepository.findOne({
          where: {
            listing: { id: listingId },
            feature: { id: featureId },
          },
        });

        if (existingFeature) {
          results.push(existingFeature); 
          continue;
        }

        const newListingFeature = this.carListingFeatureRepository.create({
          listing: listing,
          feature: feature,
        });

        const savedFeature = await this.carListingFeatureRepository.save(newListingFeature);
        results.push(savedFeature);
      } catch (error) {
        console.error(`Error adding feature ${featureId} to listing ${listingId}:`, error);
      }
    }

    return results;
  }

  /**
   * Delete all features for a specific car listing
   * @param listingId - ID of the car listing
   * @returns void
   */
  async deleteAllListingFeatures(listingId: string): Promise<void> {
    const listing = await this.carListingRepository.findOne({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException(`Car listing with ID ${listingId} not found`);
    }

    const listingFeatures = await this.carListingFeatureRepository.find({
      where: { listing: { id: listingId } },
    });

    await this.carListingFeatureRepository.remove(listingFeatures);
  }
}