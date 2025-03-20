// src/inspection-requests/dto/create-inspection-request.dto.ts
import { IsUUID, IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { InspectionRequestStatus, PaymentStatus } from '../entity/inspection-request.entity';

export class CreateInspectionRequestDto {
  @IsUUID()
  @IsNotEmpty()
  listing_id: string;

  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  package_id: string;

  @IsDateString()
  @IsNotEmpty()
  requestedDate: string;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @IsString()
  @IsOptional()
  adminNotes?: string;

  @IsString()
  @IsOptional()
  userNotes?: string;
}

// src/inspection-requests/dto/update-inspection-request.dto.ts
import { PartialType } from '@nestjs/mapped-types';

export class UpdateInspectionRequestDto extends PartialType(CreateInspectionRequestDto) {
  @IsEnum(InspectionRequestStatus)
  @IsOptional()
  status?: InspectionRequestStatus;

  @IsDateString()
  @IsOptional()
  completionDate?: string;

  @IsEnum(PaymentStatus)
  @IsOptional()
  advancePaymentStatus?: PaymentStatus;

  @IsEnum(PaymentStatus)
  @IsOptional()
  totalPaymentStatus?: PaymentStatus;

  @IsDateString()
  @IsOptional()
  fullPaymentDate?: string;
}