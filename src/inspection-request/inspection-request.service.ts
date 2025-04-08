import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InspectionRequest } from './entity/inspection-request.entity';
import { CreateInspectionRequestDto } from './dto/inspection-request.dto';
import { UpdateInspectionRequestDto } from './dto/inspection-request.dto';
import { CarListing } from 'src/car-listings/car-listing.entity';
import { User } from 'src/users/entities/user.entity';
import { InspectionPackage } from 'src/inspection-packages/entity/inspection-packages.entity';

@Injectable()
export class InspectionRequestService {
  constructor(
    @InjectRepository(InspectionRequest)
    private inspectionRequestRepository: Repository<InspectionRequest>,
    @InjectRepository(CarListing)
    private carListingRepository: Repository<CarListing>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(InspectionPackage)
    private inspectionPackageRepository: Repository<InspectionPackage>,
  ) {}

  async create(createInspectionRequestDto: CreateInspectionRequestDto, user_id): Promise<InspectionRequest> {
    const { listing_id, package_id, requestedDate, scheduledDate, ...restData } = createInspectionRequestDto;

    const listing = await this.carListingRepository.findOne({ where: { id: listing_id } });
    if (!listing) {
      throw new NotFoundException(`Car listing with ID ${listing_id} not found`);
    }

    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const inspectionPackage = await this.inspectionPackageRepository.findOne({ where: { id: package_id } });
    if (!inspectionPackage) {
      throw new NotFoundException(`Inspection package with ID ${package_id} not found`);
    }

    const inspectionRequest = new InspectionRequest();
    inspectionRequest.listing = listing;
    inspectionRequest.user = user;
    inspectionRequest.package = inspectionPackage;
    inspectionRequest.requestedDate = new Date(requestedDate);
    inspectionRequest.scheduledDate = new Date(scheduledDate!);
    inspectionRequest.location = restData.location;
    inspectionRequest.contactPhone = restData.contactPhone!;
    inspectionRequest.totalPrice = restData.totalPrice;
    inspectionRequest.adminNotes = restData.adminNotes!;
    inspectionRequest.userNotes = restData.userNotes!;

    return this.inspectionRequestRepository.save(inspectionRequest);
  }

  async findAll(): Promise<InspectionRequest[]> {
    return this.inspectionRequestRepository.find({
      relations: ['listing', 'user', 'package'],
    });
  }

  async findOne(id: string): Promise<InspectionRequest> {
    const inspectionRequest = await this.inspectionRequestRepository.findOne({
      where: { id },
      relations: ['listing', 'user', 'package'],
    });
    
    if (!inspectionRequest) {
      throw new NotFoundException(`Inspection request with ID ${id} not found`);
    }
    
    return inspectionRequest;
  }

  async update(id: string, updateInspectionRequestDto: UpdateInspectionRequestDto, user_id): Promise<InspectionRequest> {
    const inspectionRequest = await this.findOne(id);
    
    const { 
      listing_id, 
      package_id, 
      requestedDate, 
      scheduledDate, 
      completionDate, 
      fullPaymentDate,
      ...restData 
    } = updateInspectionRequestDto;

    if (listing_id) {
      const listing = await this.carListingRepository.findOne({ where: { id: listing_id } });
      if (!listing) {
        throw new NotFoundException(`Car listing with ID ${listing_id} not found`);
      }
      inspectionRequest.listing = listing;
    }

    if (user_id) {
      const user = await this.userRepository.findOne({ where: { id: user_id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${user_id} not found`);
      }
      inspectionRequest.user = user;
    }

    if (package_id) {
      const inspectionPackage = await this.inspectionPackageRepository.findOne({ where: { id: package_id } });
      if (!inspectionPackage) {
        throw new NotFoundException(`Inspection package with ID ${package_id} not found`);
      }
      inspectionRequest.package = inspectionPackage;
    }

    if (requestedDate) {
      inspectionRequest.requestedDate = new Date(requestedDate);
    }
    
    if (scheduledDate) {
      inspectionRequest.scheduledDate = new Date(scheduledDate);
    }
    
    if (completionDate) {
      inspectionRequest.completionDate = new Date(completionDate);
    }
    
    if (fullPaymentDate) {
      inspectionRequest.fullPaymentDate = new Date(fullPaymentDate);
    }

    if (restData.location !== undefined) {
      inspectionRequest.location = restData.location;
    }
    
    if (restData.contactPhone !== undefined) {
      inspectionRequest.contactPhone = restData.contactPhone;
    }
    
    if (restData.totalPrice !== undefined) {
      inspectionRequest.totalPrice = restData.totalPrice;
    }
    
    if (restData.status !== undefined) {
      inspectionRequest.status = restData.status;
    }
    
    if (restData.advancePaymentStatus !== undefined) {
      inspectionRequest.advancePaymentStatus = restData.advancePaymentStatus;
    }
    
    if (restData.totalPaymentStatus !== undefined) {
      inspectionRequest.totalPaymentStatus = restData.totalPaymentStatus;
    }
    
    if (restData.adminNotes !== undefined) {
      inspectionRequest.adminNotes = restData.adminNotes;
    }
    
    if (restData.userNotes !== undefined) {
      inspectionRequest.userNotes = restData.userNotes;
    }

    return this.inspectionRequestRepository.save(inspectionRequest);
  }

  async remove(id: string): Promise<void> {
    const inspectionRequest = await this.findOne(id);
    await this.inspectionRequestRepository.remove(inspectionRequest);
  }
}