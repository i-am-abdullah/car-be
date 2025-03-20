import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionPackage } from './entity/inspection-packages.entity';
import { InspectionPackageController } from './inspection-package.controller';
import { InspectionPackageService } from './inspection-package.service';

@Module({
  imports: [TypeOrmModule.forFeature([InspectionPackage])],
  controllers: [InspectionPackageController],
  providers: [InspectionPackageService],
  exports: [InspectionPackageService],
})
export class InspectionPackageModule {}