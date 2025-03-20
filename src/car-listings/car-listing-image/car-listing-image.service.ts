// src/car-listing/services/car-listing-image.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarListingImage } from './car-listing-image.entity';
import { CarListing } from '../car-listing.entity';

@Injectable()
export class CarListingImageService {
  constructor(
    @InjectRepository(CarListingImage)
    private carListingImageRepository: Repository<CarListingImage>,
    
    @InjectRepository(CarListing)
    private carListingRepository: Repository<CarListing>,
  ) {}

  /**
   * Create a new image for a car listing
   * @param listingId - ID of the car listing to add the image to
   * @param imageUrl - URL of the image to add
   * @returns The created car listing image
   */
  async createImage(listingId: string, imageUrl: string): Promise<CarListingImage> {
    // Check if the listing exists
    const listing = await this.carListingRepository.findOne({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException(`Car listing with ID ${listingId} not found`);
    }

    // Create and save the new image
    const newImage = this.carListingImageRepository.create({
      image_url: imageUrl,
      listing: listing,
    });

    return this.carListingImageRepository.save(newImage);
  }

  /**
   * Get all images for a specific car listing
   * @param listingId - ID of the car listing
   * @returns Array of car listing images
   */
  async getImagesByListingId(listingId: string): Promise<CarListingImage[]> {
    // Check if the listing exists
    const listing = await this.carListingRepository.findOne({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException(`Car listing with ID ${listingId} not found`);
    }

    // Get all images for the listing
    return this.carListingImageRepository.find({
      where: { listing: { id: listingId } },
      order: { created_at: 'ASC' },
    });
  }

  /**
   * Delete an image by its ID
   * @param imageId - ID of the image to delete
   * @returns void
   */
  async deleteImage(imageId: string): Promise<void> {
    const image = await this.carListingImageRepository.findOne({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException(`Car listing image with ID ${imageId} not found`);
    }

    await this.carListingImageRepository.remove(image);
  }

  /**
   * Create multiple images for a car listing
   * @param listingId - ID of the car listing
   * @param imageUrls - Array of image URLs to add
   * @returns Array of created car listing images
   */
  async createMultipleImages(listingId: string, imageUrls: string[]): Promise<CarListingImage[]> {
    // Check if the listing exists
    const listing = await this.carListingRepository.findOne({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException(`Car listing with ID ${listingId} not found`);
    }

    // Create image entities
    const imageEntities = imageUrls.map(url => 
      this.carListingImageRepository.create({
        image_url: url,
        listing: listing,
      })
    );

    // Save all images at once
    return this.carListingImageRepository.save(imageEntities);
  }

  /**
   * Delete all images for a specific car listing
   * @param listingId - ID of the car listing
   * @returns void
   */
  async deleteAllListingImages(listingId: string): Promise<void> {
    // Check if the listing exists
    const listing = await this.carListingRepository.findOne({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException(`Car listing with ID ${listingId} not found`);
    }

    // Find all images for the listing
    const images = await this.carListingImageRepository.find({
      where: { listing: { id: listingId } },
    });

    // Remove all images
    await this.carListingImageRepository.remove(images);
  }
}