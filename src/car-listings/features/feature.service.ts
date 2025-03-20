import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Features } from './feature.entity';
import { CreateFeatureDto } from './feature.dto';


@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Features)
    private FeaturesRepository: Repository<Features>,
  ) {}

  /**
   * Add a single feature
   * @param createFeatureDto - Feature data to create
   * @returns Created feature
   */
  async addFeature(createFeatureDto: CreateFeatureDto): Promise<Features> {
    try {
      // Check if feature already exists by name
      const existingFeature = await this.FeaturesRepository.findOne({
        where: { name: createFeatureDto.name },
      });

      if (existingFeature) {
        throw new ConflictException(`Feature with name "${createFeatureDto.name}" already exists`);
      }

      // Create new feature
      const newFeature = this.FeaturesRepository.create(createFeatureDto);
      return await this.FeaturesRepository.save(newFeature);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Failed to add feature: ${error.message}`);
    }
  }

  /**
   * Add multiple features at once
   * @param createFeatureDtos - Array of feature data to create
   * @returns Array of created features
   */
  async addMultipleFeatures(createFeatureDtos: CreateFeatureDto[]): Promise<Features[]> {
    try {
      const results: Features[] = [];
      const skippedFeatures: string[] = [];

      // Process each feature 
      for (const featureDto of createFeatureDtos) {
        try {
          // Check if feature already exists
          const existingFeature = await this.FeaturesRepository.findOne({
            where: { name: featureDto.name },
          });

          if (existingFeature) {
            skippedFeatures.push(featureDto.name);
            continue;
          }

          // Create and save the feature
          const newFeature = this.FeaturesRepository.create(featureDto);
          const savedFeature = await this.FeaturesRepository.save(newFeature);
          results.push(savedFeature);
        } catch (error) {
          // Log error but continue with next feature
          console.error(`Error adding feature "${featureDto.name}": ${error.message}`);
        }
      }

      // If no features were added, throw an error
      if (results.length === 0 && createFeatureDtos.length > 0) {
        throw new ConflictException(
          `Failed to add any features. Skipped features: ${skippedFeatures.join(', ')}`,
        );
      }

      return results;
    } catch (error) {
      throw new Error(`Failed to add multiple features: ${error.message}`);
    }
  }

  /**
   * Get all features with optional active filter
   * @param activeOnly - If true, returns only active features
   * @returns Array of features
   */
  async getAllFeatures(activeOnly: boolean = false): Promise<Features[]> {
    try {
      const queryOptions: any = {};
      
      if (activeOnly) {
        queryOptions.where = { is_active: true };
      }
      
      return await this.FeaturesRepository.find(queryOptions);
    } catch (error) {
      throw new Error(`Failed to get features: ${error.message}`);
    }
  }

  /**
   * Get feature by ID
   * @param id - Feature ID
   * @returns Feature or undefined
   */
  async getFeatureById(id: string): Promise<Features> {
    const feature = await this.FeaturesRepository.findOne({
      where: { id },
    });

    if (!feature) {
      throw new NotFoundException(`Feature with ID "${id}" not found`);
    }

    return feature;
  }

  /**
   * Update feature
   * @param id - Feature ID
   * @param updateData - Data to update
   * @returns Updated feature
   */
  async updateFeature(
    id: string, 
    updateData: Partial<CreateFeatureDto>
  ): Promise<Features> {
    const feature = await this.getFeatureById(id);
    
    // Check name uniqueness if name is being updated
    if (updateData.name && updateData.name !== feature.name) {
      const existingFeature = await this.FeaturesRepository.findOne({
        where: { name: updateData.name },
      });
      
      if (existingFeature) {
        throw new ConflictException(`Feature with name "${updateData.name}" already exists`);
      }
    }

    // Update and save
    Object.assign(feature, updateData);
    return await this.FeaturesRepository.save(feature);
  }

  /**
   * Delete feature by ID
   * @param id - Feature ID
   * @returns Deletion result
   */
  async deleteFeature(id: string): Promise<void> {
    const feature = await this.getFeatureById(id);
    await this.FeaturesRepository.remove(feature);
  }
}