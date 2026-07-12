// Get Appointments DTO - Appointments filter karne ke liye
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class GetAppointmentsDto {
  // Status filter - pending, confirmed, upcoming, completed, cancelled, rejected, ya all
  @IsEnum(['pending', 'confirmed', 'upcoming', 'completed', 'cancelled', 'rejected', 'all'], {
    message: 'Status invalid hai',
  })
  @IsOptional()
  status?: 'pending' | 'confirmed' | 'upcoming' | 'completed' | 'cancelled' | 'rejected' | 'all';

  // Start date filter
  @IsString()
  @IsOptional()
  startDate?: string;

  // End date filter
  @IsString()
  @IsOptional()
  endDate?: string;
}
