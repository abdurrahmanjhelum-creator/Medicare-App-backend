// Get Appointments DTO - Appointments filter karne ke liye
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class GetAppointmentsDto {
  // Status filter - upcoming, completed, cancelled, ya all
  @IsEnum(['upcoming', 'completed', 'cancelled', 'all'], { message: 'Status invalid hai' })
  @IsOptional()
  status?: 'upcoming' | 'completed' | 'cancelled' | 'all';

  // Start date filter
  @IsString()
  @IsOptional()
  startDate?: string;

  // End date filter
  @IsString()
  @IsOptional()
  endDate?: string;
}
