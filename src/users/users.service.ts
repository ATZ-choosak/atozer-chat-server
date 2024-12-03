import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, CreateUserGoogleDto } from './dto/create.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(creatUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(creatUserDto);
    return createdUser.save();
  }

  async createByGoogleLogin(
    createUsergoogleDto: CreateUserGoogleDto,
  ): Promise<UserDocument> {
    const createdUser = new this.userModel({
      ...createUsergoogleDto,
      is_verify: true,
    });
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).exec();

    return user;
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    return user;
  }
}
