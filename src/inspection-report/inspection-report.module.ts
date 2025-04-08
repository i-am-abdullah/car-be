import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionReportsController } from './inspection-report.controller';
import { InspectionReportsService } from './inspection-report.service';
import { InspectionReport } from './entity/inspection-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InspectionReport])],
  controllers: [InspectionReportsController],
  providers: [InspectionReportsService],
  exports: [InspectionReportsService],
})
export class InspectionReportsModule {}