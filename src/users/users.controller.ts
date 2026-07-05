// Users Controller - User management endpoints handle karne ke liye
import { Controller, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Get Profile endpoint - Current user ka profile lein (protected)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  // Update Profile endpoint - User profile update karein (protected)
  @Put('profile')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.userId, updateUserDto);
  }

  // Change Password endpoint - User ka password change karein (protected)
  @Put('change-password')
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.userId, changePasswordDto);
  }

  // Get User By ID endpoint - User lein by ID (admin only)
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get(':id')
  async getUserById(@Param('id') userId: string) {
    return this.usersService.getUserById(userId);
  }

  // Delete User endpoint - User delete karein (admin only)
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
