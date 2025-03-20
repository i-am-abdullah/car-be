import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { dataSourceOptions } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { FeatureModule } from './car-listings/features/feature.module';
import { CarPrimaryDetailsModule } from './car-listings/car-primary-detail/primary-details.module';
import { CarListingModule } from './car-listings/car-listing.module';
import { RegistrationCityModule } from './car-listings/registration-city/registration-city.module';
import { InspectionPackageModule } from './inspection-packages/inspection-package.module';
import { InspectionRequestModule } from './inspection-request/inspection-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    FeatureModule,
    CarPrimaryDetailsModule,
    CarListingModule,
    RegistrationCityModule,
    InspectionPackageModule,
    InspectionRequestModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}