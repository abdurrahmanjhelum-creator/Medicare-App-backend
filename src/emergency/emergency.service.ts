// Emergency Service - Emergency contacts logic handle karne ke liye
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmergencyContact, EmergencyContactDocument } from './entities/emergency-contact.entity';

@Injectable()
export class EmergencyService {
  constructor(
    @InjectModel(EmergencyContact.name) private emergencyContactModel: Model<EmergencyContactDocument>,
  ) {}

  // Get Contacts method - Saare emergency contacts lein
  async getContacts() {
    // Saare emergency contacts lein database se
    const contacts = await this.emergencyContactModel.find().sort({ title: 1 }).exec();

    return {
      contacts,
      total: contacts.length,
    };
  }

  // Get Contact By ID method - Single emergency contact lein
  async getContactById(contactId: string) {
    // Contact lein database se
    const contact = await this.emergencyContactModel.findById(contactId).exec();

    if (!contact) {
      throw new Error('Emergency contact not found');
    }

    return { contact };
  }
}
