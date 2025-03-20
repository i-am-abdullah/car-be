import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarGeneralDetail } from './car-general-detail.entity';

@Injectable()
export class CarGeneralDetailService {
  constructor(
    @InjectRepository(CarGeneralDetail)
    private carGeneralDetailRepository: Repository<CarGeneralDetail>,
  ) {}

  /**
   * Create a new car general detail
   * @param data The car general detail data
   * @returns The created car general detail
   */
  async create(data: Partial<CarGeneralDetail>): Promise<CarGeneralDetail> {
    const newCarGeneralDetail = this.carGeneralDetailRepository.create(data);
    return this.carGeneralDetailRepository.save(newCarGeneralDetail);
  }

  /**
   * Update a car general detail by listing id
   * @param listingId The listing id
   * @param data The car general detail data to update
   * @returns The updated car general detail
   */
  async updateByListingId(listingId: string, data: Partial<CarGeneralDetail>): Promise<CarGeneralDetail> {
    const carGeneralDetail = await this.carGeneralDetailRepository.findOne({
      where: { listing: { id: listingId } },
    });

    if (!carGeneralDetail) {
      throw new NotFoundException(`Car general detail with listing id ${listingId} not found`);
    }

    Object.assign(carGeneralDetail, data);
    return this.carGeneralDetailRepository.save(carGeneralDetail);
  }

  /**
   * Delete a car general detail by listing id
   * @param listingId The listing id
   * @returns The delete result
   */
  async deleteByListingId(listingId: string): Promise<void> {
    const carGeneralDetail = await this.carGeneralDetailRepository.findOne({
      where: { listing: { id: listingId } },
    });

    if (!carGeneralDetail) {
      throw new NotFoundException(`Car general detail with listing id ${listingId} not found`);
    }

    await this.carGeneralDetailRepository.remove(carGeneralDetail);
  }

  /**
   * Get car general detail by listing id
   * @param listingId The listing id
   * @returns The car general detail
   */
  async getByListingId(listingId: string): Promise<CarGeneralDetail> {
    const carGeneralDetail = await this.carGeneralDetailRepository.findOne({
      where: { listing: { id: listingId } },
    });

    if (!carGeneralDetail) {
      throw new NotFoundException(`Car general detail with listing id ${listingId} not found`);
    }

    return carGeneralDetail;
  }
}