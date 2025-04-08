import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InspectionReport } from './entity/inspection-report.entity';
import { CreateInspectionReportDto } from './dto/inspection-report.dto';
import { UpdateInspectionReportDto } from './dto/inspection-report.dto';
import { InspectionRequestService } from 'src/inspection-request/inspection-request.service';
import { CarListingService } from 'src/car-listings/car-listing.service';

@Injectable()
export class InspectionReportsService {
  constructor(
    @InjectRepository(InspectionReport)
    private inspectionReportRepository: Repository<InspectionReport>,
    private inspectionRequestService: InspectionRequestService,
    private carListingService : CarListingService
  ) {}

  async create(createInspectionReportDto: CreateInspectionReportDto): Promise<InspectionReport> {
    const newInspectionReport = this.inspectionReportRepository.create(createInspectionReportDto);
    return await this.inspectionReportRepository.save(newInspectionReport);
  }

  async findAll(): Promise<InspectionReport[]> {
    return await this.inspectionReportRepository.find();
  }

  async findOne(id: string): Promise<InspectionReport> {
    const inspectionReport = await this.inspectionReportRepository.findOne({ where: { id } });
    if (!inspectionReport) {
      throw new NotFoundException(`Inspection report with ID ${id} not found`);
    }
    return inspectionReport;
  }

  async findByRequestId(requestId: string): Promise<InspectionReport> {
    // TypeORM expects property names that match the entity's property names, not the column names
    const request = await this.inspectionRequestService.findOne(requestId)
    const inspectionReport = await this.inspectionReportRepository.findOne({
      where: {
        inspectionRequest: request 
      }
    });
    
    if (!inspectionReport) {
      throw new NotFoundException(`Inspection report for request ID ${requestId} not found`);
    }
    
    return inspectionReport;
  }


  async update(id: string, updateInspectionReportDto: UpdateInspectionReportDto): Promise<InspectionReport> {
    const inspectionReport = await this.findOne(id);
    Object.assign(inspectionReport, updateInspectionReportDto)
    
    return await this.inspectionReportRepository.save(inspectionReport);
  }

  async remove(id: string): Promise<void> {
    const result = await this.inspectionReportRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Inspection report with ID ${id} not found`);
    }
  }
}