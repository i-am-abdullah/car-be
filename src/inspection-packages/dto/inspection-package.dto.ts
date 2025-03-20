import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInspectionPackageDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  advance_percentage?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateInspectionPackageDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  advance_percentage?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class InspectionPackageResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  advance_percentage: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}