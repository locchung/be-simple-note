import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_MODEL') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.userModel.create(createUserDto);
    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({ _id: id });
    return user;
  }

  async findUser(identifier: string) {
    const user = await this.userModel.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.userModel.findOneAndUpdate({ _id: id }, updateUserDto)
    return user;
  }

  remove(id: string) {
    return;
  }
}
