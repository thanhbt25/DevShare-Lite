import { Controller, Get, Post, Patch, Param, Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: Partial<User>) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<User>,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get('username/:username')
  async findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Post('bulk')
  async getUsersByIds(@Body() body: { ids: string[] }) {
    console.log("Bulk user lookup: ", body.ids);
    return this.usersService.findManyByIds(body.ids);
  }

  @Post(":userId/favorite/:postId")
  async addFavorite(@Param("userId") userId: string, @Param("postId") postId: string) {
    return this.usersService.addFavorite(userId, postId);
  }

  @Post(":userId/unfavorite/:postId")
  async removeFavorite(@Param("userId") userId: string, @Param("postId") postId: string) {
    return this.usersService.removeFavorite(userId, postId);
  }

  @Get(":userId/favorite")
  async getFavorite(@Param("userId") userId: string) {
    return this.usersService.getFavorite(userId);
  }
}
