import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarAdditionalDetail } from './car-additional-detail.entity';

@Injectable()
export class CarAdditionalDetailService {
  constructor(
    @InjectRepository(CarAdditionalDetail)
    private carAdditionalDetailRepository: Repository<CarAdditionalDetail>,
  ) {}

  /**
   * Create a new car additional detail
   * @param data The car additional detail data
   * @returns The created car additional detail
   */
  async create(data: Partial<CarAdditionalDetail>): Promise<CarAdditionalDetail> {
    const newCarAdditionalDetail = this.carAdditionalDetailRepository.create(data);
    return this.carAdditionalDetailRepository.save(newCarAdditionalDetail);
  }

  /**
   * Update a car additional detail by listing id
   * @param listingId The listing id
   * @param data The car additional detail data to update
   * @returns The updated car additional detail
   */
  async updateByListingId(listingId: string, data: Partial<CarAdditionalDetail>): Promise<CarAdditionalDetail> {
    const carAdditionalDetail = await this.carAdditionalDetailRepository.findOne({
      where: { listing: { id: listingId } },
    });

    if (!carAdditionalDetail) {
      throw new NotFoundException(`Car additional detail with listing id ${listingId} not found`);
    }

    Object.assign(carAdditionalDetail, data);
    return this.carAdditionalDetailRepository.save(carAdditionalDetail);
  }

  /**
   * Delete a car additional detail by listing id
   * @param listingId The listing id
   * @returns The delete result
   */
  async deleteByListingId(listingId: string): Promise<void> {
    const carAdditionalDetail = await this.carAdditionalDetailRepository.findOne({
      where: { listing: { id: listingId } },
    });

    if (!carAdditionalDetail) {
      throw new NotFoundException(`Car additional detail with listing id ${listingId} not found`);
    }

    await this.carAdditionalDetailRepository.remove(carAdditionalDetail);
  }

  /**
   * Get car additional detail by listing id
   * @param listingId The listing id
   * @returns The car additional detail
   */
  async getByListingId(listingId: string): Promise<CarAdditionalDetail> {
    const carAdditionalDetail = await this.carAdditionalDetailRepository.findOne({
      where: { listing: { id: listingId } },
    });

    if (!carAdditionalDetail) {
      throw new NotFoundException(`Car additional detail with listing id ${listingId} not found`);
    }

    return carAdditionalDetail;
  }
}