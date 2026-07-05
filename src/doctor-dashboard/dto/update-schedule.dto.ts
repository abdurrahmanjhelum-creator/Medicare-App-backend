// Update Schedule DTO - Doctor ki availability schedule update karne ke liye
import { IsArray, IsString, IsOptional } from 'class-validator';

export class UpdateScheduleDto {
  // Available days - array of days (e.g., ['Monday', 'Tuesday', 'Wednesday'])
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  availableDays?: string[];

  // Available time slots - array of time slots (e.g., ['09:00-10:00', '10:00-11:00'])
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  availableSlots?: string[];
}
