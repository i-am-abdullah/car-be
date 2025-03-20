// src/car/services/primary-details.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarMake } from './entities/car-make.entity';
import { CarModel } from './entities/car-model.entity';
import { CarYear } from './entities/car-year.entity';
import { CarVariant } from './entities/car-variant.entity';

@Injectable()
export class PrimaryDetailsService {
  constructor(
    @InjectRepository(CarMake)
    private carMakeRepository: Repository<CarMake>,
    
    @InjectRepository(CarModel)
    private carModelRepository: Repository<CarModel>,
    
    @InjectRepository(CarYear)
    private carYearRepository: Repository<CarYear>,
    
    @InjectRepository(CarVariant)
    private carVariantRepository: Repository<CarVariant>,
  ) {}

  // CarMake Methods
  async getAllCarMakes(): Promise<CarMake[]> {
    return this.carMakeRepository.find();
  }

  async getCarMakeById(id: string): Promise<CarMake> {
    const make = await this.carMakeRepository.findOne({
      where: { id },
    });
    
    if (!make) {
      throw new NotFoundException(`Car make with ID ${id} not found`);
    }
    
    return make;
  }

  // CarModel Methods
  async getAllCarModels(): Promise<CarModel[]> {
    return this.carModelRepository.find({
      relations: ['make'],
    });
  }

  async getCarModelsByMakeId(makeId: string): Promise<CarModel[]> {
    // First verify the make exists
    await this.getCarMakeById(makeId);
    
    return this.carModelRepository.find({
      where: { make: { id: makeId } },
      relations: ['make'],
    });
  }

  async getCarModelById(id: string): Promise<CarModel> {
    const model = await this.carModelRepository.findOne({
      where: { id },
      relations: ['make'],
    });
    
    if (!model) {
      throw new NotFoundException(`Car model with ID ${id} not found`);
    }
    
    return model;
  }

  // CarYear Methods
  async getAllCarYears(): Promise<CarYear[]> {
    return this.carYearRepository.find({
      relations: ['make', 'model'],
    });
  }

  async getCarYearsByMakeAndModelIds(makeId: string, modelId: string): Promise<CarYear[]> {
    // First verify the model exists and belongs to the make
    const model = await this.carModelRepository.findOne({
      where: { id: modelId, make: { id: makeId } },
      relations: ['make'],
    });
    
    if (!model) {
      throw new NotFoundException(`Car model with ID ${modelId} belonging to make ID ${makeId} not found`);
    }
    
    return this.carYearRepository.find({
      where: { 
        make: { id: makeId },
        model: { id: modelId }
      },
      relations: ['make', 'model'],
    });
  }

  async getCarYearById(id: string): Promise<CarYear> {
    const year = await this.carYearRepository.findOne({
      where: { id },
      relations: ['make', 'model'],
    });
    
    if (!year) {
      throw new NotFoundException(`Car year with ID ${id} not found`);
    }
    
    return year;
  }

  // CarVariant Methods
  async getAllCarVariants(): Promise<CarVariant[]> {
    return this.carVariantRepository.find({
      relations: ['make', 'model', 'year'],
    });
  }

  async getCarVariantsByMakeModelAndYearIds(
    makeId: string, 
    modelId: string, 
    yearId: string
  ): Promise<CarVariant[]> {
    // First verify the year exists and belongs to the model and make
    const year = await this.carYearRepository.findOne({
      where: { 
        id: yearId,
        make: { id: makeId },
        model: { id: modelId }
      },
      relations: ['make', 'model'],
    });
    
    if (!year) {
      throw new NotFoundException(`Car year with ID ${yearId} belonging to model ID ${modelId} and make ID ${makeId} not found`);
    }
    
    return this.carVariantRepository.find({
      where: { 
        make: { id: makeId },
        model: { id: modelId },
        year: { id: yearId }
      },
      relations: ['make', 'model', 'year'],
    });
  }

  async getCarVariantById(id: string): Promise<CarVariant> {
    const variant = await this.carVariantRepository.findOne({
      where: { id },
      relations: ['make', 'model', 'year'],
    });
    
    if (!variant) {
      throw new NotFoundException(`Car variant with ID ${id} not found`);
    }
    
    return variant;
  }

  // Creation methods for each entity
  async createCarMake(makeData: Partial<CarMake>): Promise<CarMake> {
    const newMake = this.carMakeRepository.create(makeData);
    return this.carMakeRepository.save(newMake);
  }

  async createCarModel(modelData: {
    name: string;
    image_url?: string;
    makeId: string;
  }): Promise<CarModel> {
    const make = await this.getCarMakeById(modelData.makeId);
    
    const newModel = this.carModelRepository.create({
      name: modelData.name,
      image_url: modelData.image_url,
      make: make,
    });
    
    return this.carModelRepository.save(newModel);
  }

  async createCarYear(yearData: {
    year: number;
    makeId: string;
    modelId: string;
  }): Promise<CarYear> {
    // Verify relation integrity
    const model = await this.carModelRepository.findOne({
      where: { id: yearData.modelId, make: { id: yearData.makeId } },
      relations: ['make'],
    });
    
    if (!model) {
      throw new NotFoundException(`Car model with ID ${yearData.modelId} belonging to make ID ${yearData.makeId} not found`);
    }
    
    const newYear = this.carYearRepository.create({
      year: yearData.year,
      make: model.make,
      model: model,
    });
    
    return this.carYearRepository.save(newYear);
  }

  async createCarVariant(variantData: {
    name: string;
    description?: string;
    makeId: string;
    modelId: string;
    yearId: string;
  }): Promise<CarVariant> {
    // Verify relation integrity
    const year = await this.carYearRepository.findOne({
      where: { 
        id: variantData.yearId,
        model: { id: variantData.modelId },
        make: { id: variantData.makeId }
      },
      relations: ['make', 'model'],
    });
    
    if (!year) {
      throw new NotFoundException(`Car year with ID ${variantData.yearId} belonging to model ID ${variantData.modelId} and make ID ${variantData.makeId} not found`);
    }
    
    const newVariant = this.carVariantRepository.create({
      name: variantData.name,
      description: variantData.description,
      make: year.make,
      model: year.model,
      year: year,
    });
    
    return this.carVariantRepository.save(newVariant);
  }
}