import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarListing } from './car-listing.entity';
import { CarAdditionalDetailService } from './car-additional-detail/car-additional-detail.service';
import { CarGeneralDetailService } from './car-general-detail/car-general-detail.service';
import { CarListingFeatureService } from './car-listing-feature/car-listing-feature.service';
import { CarListingImageService } from './car-listing-image/car-listing-image.service';
import { CreateCarListingDto } from './car-listing.dto';
import { UpdateCarListingDto } from './car-listing.dto';
import { CarVariant } from './car-primary-detail/entities/car-variant.entity';
import { PrimaryDetailsService } from './car-primary-detail/primary-details.service';
import { RegistrationCityService } from './registration-city/registration-city.service';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class CarListingService {
  constructor(
    @InjectRepository(CarListing)
    private carListingRepository: Repository<CarListing>,
    private carAdditionalDetailService: CarAdditionalDetailService,
    private carGeneralDetailService: CarGeneralDetailService,
    private carListingFeatureService: CarListingFeatureService,
    private carListingImageService: CarListingImageService,
    private primaryDetailService: PrimaryDetailsService,
    private registrationCityServce: RegistrationCityService,
    private userService: UsersService

  ) {}

  /**
   * Create a new car listing with all related entities
   * @param createCarListingDto - The data to create a car listing
   * @returns The created car listing with all related entities
   */
  async create(createCarListingDto: CreateCarListingDto, user_id:string): Promise<CarListing> {
    try {
      const { 
        additionalDetail, 
        generalDetail, 
        features, 
        images,
        variant_id,
        make_id,
        model_id,
        year_id,
        registration_city_id,
        ...listingData 
      } = createCarListingDto;
      const CarVariant = await this.primaryDetailService.getCarVariantById(variant_id);
      const CarMake = await this.primaryDetailService.getCarMakeById(make_id);
      const CarModel = await this.primaryDetailService.getCarModelById(model_id)
      const CarYear = await this.primaryDetailService.getCarYearById(year_id)
      const carRegistrationCity = await this.registrationCityServce.findOne(registration_city_id)
      const User = await this.userService.findOne(user_id!)
      if (!CarVariant || !CarMake || !CarModel || !CarYear || !carRegistrationCity) {
        throw new BadRequestException(`Invalid CarVariant ID: ${variant_id}`);
      }
      

      const newListing:CarListing = this.carListingRepository.create({...listingData,
        variant:CarVariant,
        make:CarMake,
        model:CarModel,
        year:CarYear,
        registrationCity:carRegistrationCity,
        user:User
      });

      const savedListing = await this.carListingRepository.save(newListing);
      
      if (additionalDetail) {
        await this.carAdditionalDetailService.create({
          ...additionalDetail,
          listing: savedListing,
        });
      }

      if (generalDetail) {
        await this.carGeneralDetailService.create({
          ...generalDetail,
          listing: savedListing,
        });
      }

      if (features && features.length > 0) {
        await this.carListingFeatureService.addMultipleFeaturesToListing(
          savedListing.id,
          features,
        );
      }

      if (images && images.length > 0) {
        await this.carListingImageService.createMultipleImages(
          savedListing.id,
          images,
        );
      }

      return this.findOne(savedListing.id);
    } catch (error) {
      throw new BadRequestException(`Failed to create car listing: ${error.message}`);
    }
  }

  /**
   * Find all car listings with pagination
   * @param page - The page number
   * @param limit - The number of items per page
   * @returns A paginated list of car listings
   */
  async findAll(page = 1, limit = 10): Promise<{ items: CarListing[]; total: number; page: number; limit: number }> {
    const [items, total] = await this.carListingRepository.findAndCount({
      relations: ['make', 'model', 'variant', 'year', 'registrationCity', 'user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * Find one car listing by ID with all relations
   * @param id - The ID of the car listing
   * @returns The car listing with all relations
   */
  async findOne(id: string): Promise<CarListing> {
    const listing = await this.carListingRepository.findOne({
      where: { id },
      relations: [
        'make', 
        'model', 
        'variant', 
        'year', 
        'registrationCity', 
        'user',
        'additionalDetail',
        'generalDetail',
        'features',
        'features.feature',
        'images',
      ],
    });

    if (!listing) {
      throw new NotFoundException(`Car listing with ID ${id} not found`);
    }

    return listing;
  }

  /**
   * Update a car listing and its related entities
   * @param id - The ID of the car listing to update
   * @param updateCarListingDto - The data to update the car listing
   * @returns The updated car listing with all relations
   */
  async update(id: string, updateCarListingDto: UpdateCarListingDto, user_id:string): Promise<CarListing> {
    try {
      const existingListing = await this.findOne(id);

      const { 
        additionalDetail, 
        generalDetail, 
        features, 
        images,
        variant_id,
        make_id,
        model_id,
        year_id,
        registration_city_id,
        ...listingData 
      } = updateCarListingDto;
      
      if(existingListing.user.id !== user_id){
        throw new ForbiddenException("You are not allowed to update the listing")
      }
      const CarVariant = await this.primaryDetailService.getCarVariantById(variant_id!);
      const CarMake = await this.primaryDetailService.getCarMakeById(make_id!);
      const CarModel = await this.primaryDetailService.getCarModelById(model_id!)
      const CarYear = await this.primaryDetailService.getCarYearById(year_id!)
      const carRegistrationCity = await this.registrationCityServce.findOne(registration_city_id!)

      existingListing.variant=CarVariant
      existingListing.make=CarMake
      existingListing.model = CarModel
      existingListing.year = CarYear
      existingListing.registrationCity = carRegistrationCity


      Object.assign(existingListing, listingData);
      await this.carListingRepository.save(existingListing);

      if (additionalDetail) {
        try {
          await this.carAdditionalDetailService.updateByListingId(id, additionalDetail);
        } catch (error) {
          if (error instanceof NotFoundException) {
            await this.carAdditionalDetailService.create({
              ...additionalDetail,
              listing: existingListing,
            });
          } else {
            throw error;
          }
        }
      }

      if (generalDetail) {
        try {
          await this.carGeneralDetailService.updateByListingId(id, generalDetail);
        } catch (error) {
          if (error instanceof NotFoundException) {
            await this.carGeneralDetailService.create({
              ...generalDetail,
              listing: existingListing,
            });
          } else {
            throw error;
          }
        }
      }

      if (features) {
        await this.carListingFeatureService.deleteAllListingFeatures(id);
        
        if (features.length > 0) {
          await this.carListingFeatureService.addMultipleFeaturesToListing(id, features);
        }
      }

      if (images) {
        await this.carListingImageService.deleteAllListingImages(id);
        
        if (images.length > 0) {
          await this.carListingImageService.createMultipleImages(id, images);
        }
      }

      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException(`Failed to update car listing: ${error.message}`);
    }
  }

  /**
   * Remove a car listing and all its related entities
   * @param id - The ID of the car listing to remove
   * @returns void
   */
  async remove(id: string): Promise<void> {
    const listing = await this.findOne(id);

    try {
      await this.carListingFeatureService.deleteAllListingFeatures(id);
    } catch (error) {
      console.warn(`Failed to delete listing features: ${error.message}`);
    }

    try {
      await this.carListingImageService.deleteAllListingImages(id);
    } catch (error) {
      console.warn(`Failed to delete listing images: ${error.message}`);
    }

    try {
      await this.carAdditionalDetailService.deleteByListingId(id);
    } catch (error) {
      console.warn(`Failed to delete additional detail: ${error.message}`);
    }

    try {
      await this.carGeneralDetailService.deleteByListingId(id);
    } catch (error) {
      console.warn(`Failed to delete general detail: ${error.message}`);
    }

    await this.carListingRepository.remove(listing);
  }

  /**
   * Update the status of a car listing
   * @param id - The ID of the car listing
   * @param status - The new status
   * @returns The updated car listing
   */
  async updateStatus(id: string, status: 'draft' | 'pending' | 'active' | 'sold' | 'inactive' | 'rejected'): Promise<CarListing> {
    const listing = await this.findOne(id);
    
    listing.status = status;
    return this.carListingRepository.save(listing);
  }

  /**
   * Find car listings by user ID
   * @param userId - The ID of the user
   * @param page - The page number
   * @param limit - The number of items per page
   * @returns A paginated list of the user's car listings
   */
  async findByUserId(userId: string, page = 1, limit = 10): Promise<{ items: CarListing[]; total: number; page: number; limit: number }> {
    const [items, total] = await this.carListingRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['make', 'model', 'variant', 'year', 'registrationCity'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * Find car listings by status
   * @param status - The status to filter by
   * @param page - The page number
   * @param limit - The number of items per page
   * @returns A paginated list of car listings with the specified status
   */
  async findByStatus(status: 'draft' | 'pending' | 'active' | 'sold' | 'inactive' | 'rejected', page = 1, limit = 10): Promise<{ items: CarListing[]; total: number; page: number; limit: number }> {
    const [items, total] = await this.carListingRepository.findAndCount({
      where: { status },
      relations: ['make', 'model', 'variant', 'year', 'registrationCity', 'user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * Mark a car listing as featured until a specific date
   * @param id - The ID of the car listing
   * @param featuredUntil - The date until which the listing should be featured
   * @returns The updated car listing
   */
  async markAsFeatured(id: string, featuredUntil: Date): Promise<CarListing> {
    const listing = await this.findOne(id);
    
    listing.featured_until = featuredUntil;
    return this.carListingRepository.save(listing);
  }

  /**
   * Search car listings by various criteria
   * @param searchParams - The search parameters
   * @param page - The page number
   * @param limit - The number of items per page
   * @returns A paginated list of car listings matching the search criteria
   */
  async search(searchParams: any, page = 1, limit = 10): Promise<{ items: CarListing[]; total: number; page: number; limit: number }> {
    const { makeId, modelId, yearId, variantId, minPrice, maxPrice, color, status } = searchParams;
    
    const queryBuilder = this.carListingRepository.createQueryBuilder('listing')
      .leftJoinAndSelect('listing.make', 'make')
      .leftJoinAndSelect('listing.model', 'model')
      .leftJoinAndSelect('listing.year', 'year')
      .leftJoinAndSelect('listing.variant', 'variant')
      .leftJoinAndSelect('listing.registrationCity', 'registrationCity')
      .leftJoinAndSelect('listing.user', 'user');
    
    if (makeId) {
      queryBuilder.andWhere('listing.make_id = :makeId', { makeId });
    }
    
    if (modelId) {
      queryBuilder.andWhere('listing.model_id = :modelId', { modelId });
    }
    
    if (yearId) {
      queryBuilder.andWhere('listing.year_id = :yearId', { yearId });
    }
    
    if (variantId) {
      queryBuilder.andWhere('listing.variant_id = :variantId', { variantId });
    }
    
    if (minPrice) {
      queryBuilder.andWhere('listing.price >= :minPrice', { minPrice });
    }
    
    if (maxPrice) {
      queryBuilder.andWhere('listing.price <= :maxPrice', { maxPrice });
    }
    
    if (color) {
      queryBuilder.andWhere('listing.color LIKE :color', { color: `%${color}%` });
    }
    
    if (status) {
      queryBuilder.andWhere('listing.status = :status', { status });
    }
    
    if (!status) {
      queryBuilder.andWhere('listing.status = :defaultStatus', { defaultStatus: 'active' });
    }
    
    queryBuilder.orderBy('CASE WHEN listing.featured_until > NOW() THEN 0 ELSE 1 END', 'ASC')
      .addOrderBy('listing.created_at', 'DESC');
    
    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    
    return {
      items,
      total,
      page,
      limit,
    };
  }
}