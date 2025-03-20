import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarListingService } from './car-listing.service';
import { CarListingController } from './car-listing.controller';
import { CarListing } from './car-listing.entity';
import { CarAdditionalDetail } from './car-additional-detail/car-additional-detail.entity';
import { CarGeneralDetail } from './car-general-detail/car-general-detail.entity';
import { CarListingFeature } from './car-listing-feature/car-listing-feature.entity';
import { CarListingImage } from './car-listing-image/car-listing-image.entity';
import { Features } from './features/feature.entity';
import { CarMake } from './car-primary-detail/entities/car-make.entity';
import { CarModel } from './car-primary-detail/entities/car-model.entity';
import { CarYear } from './car-primary-detail/entities/car-year.entity';
import { CarVariant } from './car-primary-detail/entities/car-variant.entity';
import { RegistrationCity } from './registration-city/registration-city.entity';
import { CarAdditionalDetailService } from './car-additional-detail/car-additional-detail.service';
import { CarGeneralDetailService } from './car-general-detail/car-general-detail.service';
import { CarListingFeatureService } from './car-listing-feature/car-listing-feature.service';
import { CarListingImageService } from './car-listing-image/car-listing-image.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/user.module';
import { PrimaryDetailsService } from './car-primary-detail/primary-details.service';
import { RegistrationCityService } from './registration-city/registration-city.service';
import { UsersService } from 'src/users/user.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CarListing,
      CarAdditionalDetail,
      CarGeneralDetail,
      CarListingFeature,
      CarListingImage,
      Features,
      CarMake,
      CarModel,
      CarYear,
      CarVariant,
      RegistrationCity,
      User
    ]),
    JwtModule,
    forwardRef(() => UsersModule)
  ],
  controllers: [CarListingController],
  providers: [
    CarListingService,
    CarAdditionalDetailService,
    CarGeneralDetailService,
    CarListingFeatureService,
    CarListingImageService,
    PrimaryDetailsService,
    RegistrationCityService,
    UsersService
  ],
  exports: [CarListingService],
})
export class CarListingModule {}