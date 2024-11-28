import { Controller } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from '@app/common/dtos/create-user.dto';

import { AuthAccessType, UserInfo } from '@app/common';

@Controller()
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @MessagePattern({ cmd: 'register' })
  async registerUser(createUserDto: CreateUserDto): Promise<AuthAccessType> {
    return await this.userServiceService.registerUser(createUserDto);
  }

  @MessagePattern({ cmd: 'login' })
  async loginUser(
    loginUserDto: Omit<CreateUserDto, 'fullName'>,
  ): Promise<AuthAccessType> {
    return await this.userServiceService.loginUser(loginUserDto);
  }

  @MessagePattern({ cmd: 'find-user-by-id' })
  async findUserById(userId: string): Promise<boolean> {
    return await this.userServiceService.findUserById(userId);
  }

  @MessagePattern({ cmd: 'get-user-profile' })
  async getUserProfile(id: string): Promise<UserInfo> {
    return await this.userServiceService.getUserProfile(id);
  }

  @MessagePattern({ cmd: 'delete-user-profile' })
  async deleteUserAccount(id: string): Promise<void> {
    await this.userServiceService.deleteUserAccount(id);
    return;
  }
}
