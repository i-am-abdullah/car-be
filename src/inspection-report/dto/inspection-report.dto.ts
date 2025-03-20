import { IsUUID, IsString, IsNumber, IsOptional, IsBoolean, Min, Max, Length, IsDecimal } from 'class-validator';

export class CreateInspectionReportDto {
  @IsUUID()
  inspection_request_id: string;

  @IsString()
  @Length(1, 50)
  overall_condition: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  condition_rating: number;

  @IsString()
  exterior_assessment: string;

  @IsString()
  interior_assessment: string;

  @IsString()
  mechanical_assessment: string;

  @IsString()
  electrical_assessment: string;

  @IsNumber()
  @Min(0)
  odometer_reading: number;

  @IsBoolean()
  @IsOptional()
  vin_verified?: boolean = false;

  @IsString()
  inspector_comments: string;

  @IsString()
  recommended_actions: string;

  @IsDecimal({ decimal_digits: '2' })
  estimated_repair_costs: number;
}

export class UpdateInspectionReportDto {
  @IsString()
  @Length(1, 50)
  @IsOptional()
  overall_condition?: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  condition_rating?: number;

  @IsString()
  @IsOptional()
  exterior_assessment?: string;

  @IsString()
  @IsOptional()
  interior_assessment?: string;

  @IsString()
  @IsOptional()
  mechanical_assessment?: string;

  @IsString()
  @IsOptional()
  electrical_assessment?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  odometer_reading?: number;

  @IsBoolean()
  @IsOptional()
  vin_verified?: boolean;

  @IsString()
  @IsOptional()
  inspector_comments?: string;

  @IsString()
  @IsOptional()
  recommended_actions?: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  estimated_repair_costs?: number;
}