import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InspectionPackage } from './entity/inspection-packages.entity';
import { CreateInspectionPackageDto, UpdateInspectionPackageDto } from './dto/inspection-package.dto';

@Injectable()
export class InspectionPackageService {
  constructor(
    @InjectRepository(InspectionPackage)
    private inspectionPackageRepository: Repository<InspectionPackage>,
  ) {}

  async findAll(): Promise<InspectionPackage[]> {
    return this.inspectionPackageRepository.find();
  }

  async findAllActive(): Promise<InspectionPackage[]> {
    return this.inspectionPackageRepository.find({
      where: { is_active: true },
    });
  }

  async findOne(id: string): Promise<InspectionPackage> {
    const inspectionPackage = await this.inspectionPackageRepository.findOne({ 
      where: { id } 
    });
    
    if (!inspectionPackage) {
      throw new NotFoundException(`Inspection Package with ID ${id} not found`);
    }
    
    return inspectionPackage;
  }

  async create(createDto: CreateInspectionPackageDto): Promise<InspectionPackage> {
    const inspectionPackage = this.inspectionPackageRepository.create(createDto);
    return this.inspectionPackageRepository.save(inspectionPackage);
  }

  async update(id: string, updateDto: UpdateInspectionPackageDto): Promise<InspectionPackage> {
    const inspectionPackage = await this.findOne(id);
    
    // Merge the existing entity with the update DTO
    const updatedInspectionPackage = this.inspectionPackageRepository.merge(
      inspectionPackage,
      updateDto,
    );
    
    return this.inspectionPackageRepository.save(updatedInspectionPackage);
  }

  async remove(id: string): Promise<void> {
    const result = await this.inspectionPackageRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Inspection Package with ID ${id} not found`);
    }
  }

  async toggleActive(id: string): Promise<InspectionPackage> {
    const inspectionPackage = await this.findOne(id);
    inspectionPackage.is_active = !inspectionPackage.is_active;
    
    return this.inspectionPackageRepository.save(inspectionPackage);
  }
}