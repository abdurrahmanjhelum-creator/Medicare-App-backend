// Get Medicines DTO - Medicines lene ke liye with filters
import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';

export class GetMedicinesDto {
  // Category filter - medicine category (e.g., "Antibiotics", "Painkillers")
  @IsString()
  @IsOptional()
  category?: string;

  // In Stock filter - sirf available medicines chahiye
  @IsBoolean()
  @IsOptional()
  inStock?: boolean;

  // Page number for pagination (optional)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  // Limit per page (optional)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20;
}
