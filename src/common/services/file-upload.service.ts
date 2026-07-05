// File Upload Service - File upload handle karne ke liye
import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  constructor() {
    // Cloudinary configuration initialize karein
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
      api_key: process.env.CLOUDINARY_API_KEY || 'demo',
      api_secret: process.env.CLOUDINARY_API_SECRET || 'demo',
    });
  }

  // Upload File method - File upload karein Cloudinary par
  async uploadFile(file: any, folder: string = 'medicare'): Promise<string> {
    try {
      // Check karein ke file hai
      if (!file) {
        throw new BadRequestException('File zaroori hai');
      }

      // File size check karein (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new BadRequestException('File size maximum 5MB hona chahiye');
      }

      // File type check karein
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException('Sirf JPEG, PNG, aur PDF files allowed hain');
      }

      // File upload karein Cloudinary par
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      });

      // Local file delete karein
      this.deleteLocalFile(file.path);

      return result.secure_url;
    } catch (error) {
      // Local file delete karein agar error aaya
      if (file && file.path) {
        this.deleteLocalFile(file.path);
      }
      throw new BadRequestException(`File upload failed: ${(error as any).message}`);
    }
  }

  // Upload Multiple Files method - Multiple files upload karein
  async uploadMultipleFiles(files: any[], folder: string = 'medicare'): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files zaroori hain');
    }

    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    const urls = await Promise.all(uploadPromises);

    return urls;
  }

  // Delete File method - File delete karein Cloudinary se
  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new BadRequestException(`File delete failed: ${(error as any).message}`);
    }
  }

  // Delete Local File helper method - Local file delete karein
  private deleteLocalFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      // Ignore error agar file delete nahi hui
      console.error('Local file delete error:', (error as any).message);
    }
  }

  // Get File Info method - File information lein
  async getFileInfo(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      throw new BadRequestException(`File info fetch failed: ${(error as any).message}`);
    }
  }
}
