import { IsNotEmpty, IsString } from 'class-validator';

export class GetDoctorDetailsDto {
  @IsNotEmpty()
  @IsString()
  doctorId: string;
}
