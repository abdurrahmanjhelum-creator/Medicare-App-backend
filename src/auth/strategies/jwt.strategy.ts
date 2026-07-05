// JWT Strategy - Passport JWT token validation strategy
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super({
      // JWT token ko Authorization header se extract karein
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Token expiration ignore karein (optional)
      ignoreExpiration: false,
      // Secret key from environment variables
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  // validate method - Token verify hone ke baad user data return karega
  async validate(payload: any) {
    // Payload se user ID lein
    const { sub: userId, email, role } = payload;

    // Database se user lein
    const user = await this.userModel.findById(userId);

    // Agar user nahi mila ya inactive hai, toh error throw karein
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // User data return karein - ye request.user mein save hoga
    return {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };
  }
}
