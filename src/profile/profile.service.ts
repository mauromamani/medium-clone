import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowEntity } from './follow.entity';
import { ProfileResponseInterface, ProfileType } from './types';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  public async getProfile(
    userId: number,
    username: string,
  ): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({ username });

    if (!profile) {
      throw new HttpException('Profle not Found!', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepository.findOne({
      followerId: userId,
      followingId: profile.id,
    });

    return { ...profile, following: Boolean(follow) };
  }

  public async followProfile(
    userId: number,
    username: string,
  ): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({ username });

    if (!profile) {
      throw new HttpException('Profle not Found!', HttpStatus.NOT_FOUND);
    }

    if (userId === profile.id) {
      throw new HttpException(
        'Follower and Following cant be equal!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({
      followerId: userId,
      followingId: profile.id,
    });

    if (!follow) {
      const followToCreate = new FollowEntity(userId, profile.id);
      await this.followRepository.save(followToCreate);
    }

    return { ...profile, following: true };
  }

  public async unfollowProfile(
    userId: number,
    username: string,
  ): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({ username });

    if (!profile) {
      throw new HttpException('Profle not Found!', HttpStatus.NOT_FOUND);
    }

    if (userId === profile.id) {
      throw new HttpException(
        'Follower and Following cant be equal!',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.followRepository.delete({
      followerId: userId,
      followingId: profile.id,
    });

    return { ...profile, following: false };
  }

  public buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    return { profile };
  }
}
