import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs'; 

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(data);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({
      username: username.toLowerCase(),
    }).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      email: email.toLowerCase(),
    }).exec();
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    console.log("Updating user with ID:", id, "Data:", data);
    if (data.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      data.password = hashedPassword;
    }

    const updated = await this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
    console.log("updated user is", updated);
    return updated ? updated?.toObject() : null;
  }
}
