// Emergency Controller - Emergency contact endpoints handle karne ke liye
import { Controller, Get, Param } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('emergency')
export class EmergencyController {
  constructor(private emergencyService: EmergencyService) {}

  // Get Contacts endpoint - Saare emergency contacts lein (public)
  @Public()
  @Get('contacts')
  async getContacts() {
    return this.emergencyService.getContacts();
  }

  // Get Contact By ID endpoint - Single emergency contact lein (public)
  @Public()
  @Get('contacts/:id')
  async getContactById(@Param('id') contactId: string) {
    return this.emergencyService.getContactById(contactId);
  }
}
