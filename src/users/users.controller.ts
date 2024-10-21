import { Controller, Get, NotFoundException, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';


@ApiTags("User")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Get("/profile")
  async getProfile(@Request() req) {

    const profile = await this.usersService.findByEmail(req.user.email)

    if(!profile){
      throw new NotFoundException("User not found.")
    }

    const result = profile.toObject()
    return {
      _id: result._id,
      name: result.name,
      email: result.email,
      image: result.image,
      is_verify: result.is_verify
    }
  }
}
