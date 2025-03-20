import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionRequestController } from './inspection-request.controller';
import { InspectionRequestService } from './inspection-request.service';
import { InspectionRequest } from './entity/inspection-request.entity';
import { CarListing } from 'src/car-listings/car-listing.entity';
import { User } from 'src/users/entities/user.entity';
import { InspectionPackage } from 'src/inspection-packages/entity/inspection-packages.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InspectionRequest,
      CarListing,
      User,
      InspectionPackage
    ]),
  ],
  controllers: [InspectionRequestController],
  providers: [InspectionRequestService],
  exports: [InspectionRequestService],
})
export class InspectionRequestModule {}