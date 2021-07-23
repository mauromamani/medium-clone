import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'follows' })
export class FollowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  followerId: number;

  @Column()
  followingId: number;

  constructor(followerId: number, followingId: number) {
    this.followerId = followerId;
    this.followingId = followingId;
  }
}
