import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationCityService } from './registration-city.service';
import { RegistrationCityController } from './registration-city.controller';
import { RegistrationCity } from './registration-city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegistrationCity])],
  controllers: [RegistrationCityController],
  providers: [RegistrationCityService],
  exports: [RegistrationCityService],
})
export class RegistrationCityModule {}