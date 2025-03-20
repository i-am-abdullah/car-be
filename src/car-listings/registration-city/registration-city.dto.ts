import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRegistrationCityDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;
}

import { PartialType } from '@nestjs/mapped-types';

export class UpdateRegistrationCityDto extends PartialType(CreateRegistrationCityDto) {}