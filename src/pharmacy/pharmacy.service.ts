// Pharmacy Service - Pharmacy logic handle karne ke liye
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine, MedicineDocument } from './entities/medicine.entity';
import { GetMedicinesDto } from './dto/get-medicines.dto';
import { SearchMedicinesDto } from './dto/search-medicines.dto';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectModel(Medicine.name) private medicineModel: Model<MedicineDocument>,
  ) {}

  // Get Medicines method - Saare medicines lein with optional filters
  async getMedicines(getMedicinesDto: GetMedicinesDto) {
    const { category, inStock, page = 1, limit = 20 } = getMedicinesDto;

    // Query build karein
    const query: any = {};

    // Agar category filter hai, toh add karein
    if (category) {
      query.category = category;
    }

    // Agar inStock filter hai, toh add karein
    if (inStock !== undefined) {
      query.inStock = inStock;
    }

    // Pagination calculate karein
    const skip = (page - 1) * limit;

    // Medicines lein database se
    const medicines = await this.medicineModel
      .find(query)
      .sort({ title: 1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Total count calculate karein
    const total = await this.medicineModel.countDocuments(query);

    return {
      medicines,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Search Medicines method - Medicines search karein by name ya description
  async searchMedicines(searchMedicinesDto: SearchMedicinesDto) {
    const { query, category } = searchMedicinesDto;

    // Query build karein
    const queryObj: any = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    };

    // Agar category filter hai, toh add karein
    if (category) {
      queryObj.category = category;
    }

    // Medicines search karein database se
    const medicines = await this.medicineModel
      .find(queryObj)
      .sort({ title: 1 })
      .limit(50)
      .exec();

    return {
      medicines,
      total: medicines.length,
    };
  }

  // Get Medicine By ID method - Single medicine lein
  async getMedicineById(medicineId: string) {
    // Medicine lein database se
    const medicine = await this.medicineModel.findById(medicineId).exec();

    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    return { medicine };
  }

  // Get Categories method - Saare unique categories lein
  async getCategories() {
    // Unique categories lein database se
    const categories = await this.medicineModel.distinct('category').exec();

    return {
      categories,
      total: categories.length,
    };
  }
}
