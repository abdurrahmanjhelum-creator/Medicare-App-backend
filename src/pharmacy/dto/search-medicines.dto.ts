// Search Medicines DTO - Medicines search karne ke liye
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SearchMedicinesDto {
  // Query - search term (medicine name ya description)
  @IsString()
  @IsNotEmpty({ message: 'Search query zaroori hai' })
  query: string;

  // Category filter - specific category mein search (optional)
  @IsString()
  @IsOptional()
  category?: string;
}
