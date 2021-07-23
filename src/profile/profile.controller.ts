import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResponseInterface } from './types/profileResponse.interface';

@Controller('/profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/:username')
  @UseGuards(AuthGuard)
  public async getProfile(
    @User('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(userId, username);

    return this.profileService.buildProfileResponse(profile);
  }

  @Post('/:username/follow')
  @UseGuards(AuthGuard)
  public async followProfile(
    @User('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.followProfile(userId, username);

    return this.profileService.buildProfileResponse(profile);
  }

  @Delete('/:username/follow')
  @UseGuards(AuthGuard)
  public async unfollowProfile(
    @User('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.unfollowProfile(userId, username);

    return this.profileService.buildProfileResponse(profile);
  }
}
