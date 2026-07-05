// Pharmacy Controller - Pharmacy endpoints handle karne ke liye
import { Controller, Get, Query, Param } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { Public } from '../common/decorators/public.decorator';
import { GetMedicinesDto } from './dto/get-medicines.dto';
import { SearchMedicinesDto } from './dto/search-medicines.dto';

@Controller('pharmacy')
export class PharmacyController {
  constructor(private pharmacyService: PharmacyService) {}

  // Get Medicines endpoint - Saare medicines lein with filters (public)
  @Public()
  @Get('medicines')
  async getMedicines(@Query() getMedicinesDto: GetMedicinesDto) {
    return this.pharmacyService.getMedicines(getMedicinesDto);
  }

  // Search Medicines endpoint - Medicines search karein (public)
  @Public()
  @Get('medicines/search')
  async searchMedicines(@Query() searchMedicinesDto: SearchMedicinesDto) {
    return this.pharmacyService.searchMedicines(searchMedicinesDto);
  }

  // Get Medicine By ID endpoint - Single medicine lein (public)
  @Public()
  @Get('medicines/:id')
  async getMedicineById(@Param('id') medicineId: string) {
    return this.pharmacyService.getMedicineById(medicineId);
  }

  // Get Categories endpoint - Saare categories lein (public)
  @Public()
  @Get('categories')
  async getCategories() {
    return this.pharmacyService.getCategories();
  }
}
