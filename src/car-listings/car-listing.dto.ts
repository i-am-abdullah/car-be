import { IsString, IsNumber, IsOptional, IsUUID, IsEnum, IsArray, IsDateString, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCarAdditionalDetailDto {
  @IsString()
  @IsOptional()
  engine_type?: string;

  @IsString()
  @IsOptional()
  engine_capacity?: string;

  @IsString()
  @IsOptional()
  transmission?: string;

  @IsString()
  @IsOptional()
  assembly?: string;

  @IsString()
  @IsOptional()
  fuel_type?: string;
}

export class CreateCarGeneralDetailDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  reason_for_selling?: string;

  @IsString()
  @IsOptional()
  ownership_status?: string;

  @IsOptional()
  accident_history?: boolean;

  @IsNumber()
  @IsOptional()
  registration_year?: number;

  @IsString()
  @IsOptional()
  registration_number?: string;
}

export class CreateCarListingDto {
  @IsEnum(['draft', 'pending', 'active', 'sold', 'inactive', 'rejected'])
  @IsOptional()
  status?: 'draft' | 'pending' | 'active' | 'sold' | 'inactive' | 'rejected' = 'draft';

  @IsNumber()
  meter_reading: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  color: string;

  @IsString()
  location: string;

  @IsDateString()
  @IsOptional()
  listing_date?: Date;

  @IsDateString()
  @IsOptional()
  featured_until?: Date;

  @IsUUID()
  @IsOptional()
  user_id?: string;

  @IsUUID()
  variant_id: string;

  @IsUUID()
  make_id: string;

  @IsUUID()
  model_id: string;

  @IsUUID()
  year_id: string;

  @IsUUID()
  registration_city_id: string;

  @ValidateNested()
  @Type(() => CreateCarAdditionalDetailDto)
  @IsOptional()
  additionalDetail?: CreateCarAdditionalDetailDto;

  @ValidateNested()
  @Type(() => CreateCarGeneralDetailDto)
  @IsOptional()
  generalDetail?: CreateCarGeneralDetailDto;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  features?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

import { PartialType } from '@nestjs/mapped-types';

export class UpdateCarListingDto extends PartialType(CreateCarListingDto) {}

export class SearchCarListingDto {
  @IsUUID()
  @IsOptional()
  makeId?: string;

  @IsUUID()
  @IsOptional()
  modelId?: string;

  @IsUUID()
  @IsOptional()
  yearId?: string;

  @IsUUID()
  @IsOptional()
  variantId?: string;

  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @IsString()
  @IsOptional()
  color?: string;

  @IsEnum(['draft', 'pending', 'active', 'sold', 'inactive', 'rejected'])
  @IsOptional()
  status?: 'draft' | 'pending' | 'active' | 'sold' | 'inactive' | 'rejected';
}