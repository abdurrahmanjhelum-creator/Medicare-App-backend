// Reviews Controller - Reviews endpoints handle karne ke liye
import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetReviewsDto } from './dto/get-reviews.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  // Create Review endpoint - Naya review create karein (patient only)
  @Roles('patient')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createReview(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.createReview(req.user.userId, createReviewDto);
  }

  // Get Reviews By Doctor ID endpoint - Doctor ke saare reviews lein (public)
  @Get('doctor/:doctorId')
  async getReviewsByDoctorId(@Param('doctorId') doctorId: string, @Body() getReviewsDto: GetReviewsDto) {
    return this.reviewsService.getReviewsByDoctorId({ ...getReviewsDto, doctorId });
  }

  // Delete Review endpoint - Review delete karein (patient only)
  @Roles('patient')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete()
  async deleteReview(@Request() req, @Body() deleteReviewDto: DeleteReviewDto) {
    return this.reviewsService.deleteReview(req.user.userId, deleteReviewDto);
  }

  // Get My Reviews endpoint - Current patient ke saare reviews lein (patient only)
  @Roles('patient')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('my-reviews')
  async getMyReviews(@Request() req) {
    return this.reviewsService.getMyReviews(req.user.userId);
  }
}
