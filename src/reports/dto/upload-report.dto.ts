// Upload Report DTO - Lab report upload karne ke liye
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UploadReportDto {
  // Title - report ka title
  @IsString()
  @IsNotEmpty({ message: 'Report title zaroori hai' })
  title: string;

  // Category - report ka category (e.g., "Blood Test", "X-Ray", "MRI")
  @IsString()
  @IsNotEmpty({ message: 'Report category zaroori hai' })
  category: string;

  // Date - report ki date
  @IsString()
  @IsNotEmpty({ message: 'Report date zaroori hai' })
  date: string;

  // Doctor Name - jis doctor ne report banwaya
  @IsString()
  @IsNotEmpty({ message: 'Doctor name zaroori hai' })
  doctorName: string;

  // File URL - uploaded file ka URL
  @IsString()
  @IsNotEmpty({ message: 'File URL zaroori hai' })
  fileUrl: string;

  // Notes - additional notes (optional)
  @IsString()
  @IsOptional()
  notes?: string;
}
