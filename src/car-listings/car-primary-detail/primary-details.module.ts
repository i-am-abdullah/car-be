// src/car/car-primary-details.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrimaryDetailsService } from './primary-details.service';
import { CarMake } from './entities/car-make.entity';
import { CarModel } from './entities/car-model.entity';
import { CarYear } from './entities/car-year.entity';
import { CarVariant } from './entities/car-variant.entity';
import { PrimaryDetailsController } from './primary-details.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CarMake,
      CarModel,
      CarYear,
      CarVariant
    ]),
  ],
  providers: [PrimaryDetailsService],
  controllers: [PrimaryDetailsController],
  exports: [PrimaryDetailsService],
})
export class CarPrimaryDetailsModule {}