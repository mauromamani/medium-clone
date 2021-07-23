import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, getRepository } from 'typeorm';

import { ArticleEntity } from './article.entity';
import { FollowEntity } from '@app/profile/follow.entity';
import { UserEntity } from '@app/user/user.entity';
import { generateSlug } from '@app/utils/generateSlug.util';
import { CreateArticleDto, UpdateArticleDto } from './dtos';
import { ArticleResponseInterface, ArticlesResponseInterface } from './types';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  public async findAllArticles(
    userId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    if (query.author) {
      try {
        const author = await this.userRepository.findOne({
          username: query.author,
        });
        queryBuilder.andWhere('articles.authorId = :id', {
          id: author.id,
        });
      } catch (e) {
        throw new HttpException('Author not Found!', HttpStatus.NOT_FOUND);
      }
    }

    if (query.favorited) {
      try {
        const author = await this.userRepository.findOne(
          {
            username: query.favorited,
          },
          { relations: ['favorites'] },
        );
        const ids = author.favorites.map((favorite) => favorite.id);

        if (ids.length > 0) {
          queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
        } else {
          queryBuilder.andWhere('1=0');
        }
      } catch (e) {
        throw new HttpException('Author not Found!', HttpStatus.NOT_FOUND);
      }
    }

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}`,
      });
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favoriteIds: number[] = [];

    if (userId) {
      const currentUser = await this.userRepository.findOne(userId, {
        relations: ['favorites'],
      });
      favoriteIds = currentUser.favorites.map((el) => el.id);
    }

    queryBuilder.orderBy('articles.createdAt', 'DESC');
    const articlesCount = await queryBuilder.getCount();
    const articles = await queryBuilder.getMany();
    const articlesWithFavorites = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id);
      return { ...article, favorited };
    });

    return { articles: articlesWithFavorites, articlesCount };
  }

  public async findArticleBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({ where: { slug } });

    if (!article) {
      throw new HttpException('Article not Found!', HttpStatus.NOT_FOUND);
    }

    return article;
  }

  public async getFeed(
    userId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const follows = await this.followRepository.find({ followerId: userId });

    if (!follows.length) {
      return { articles: [], articlesCount: 0 };
    }

    const followingUsersIds = follows.map((follow) => follow.followingId);
    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.authorId IN (:...ids)', { ids: followingUsersIds });

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }

  public async createArticle(
    user: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const newArticle = new ArticleEntity(createArticleDto);

    if (!newArticle.tagList) {
      newArticle.tagList = [];
    }

    newArticle.author = user;
    newArticle.slug = generateSlug(createArticleDto.title);

    return await this.articleRepository.save(newArticle);
  }

  public async updateArticleBySlug(
    userId: number,
    slug: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findArticleBySlug(slug);

    if (article.author.id !== userId) {
      throw new HttpException('You are not an author!', HttpStatus.FORBIDDEN);
    }

    if (updateArticleDto.title) {
      article.slug = generateSlug(updateArticleDto.title);
    }

    Object.assign(article, updateArticleDto);
    return await this.articleRepository.save(article);
  }

  public async deleteArticleBySlug(
    userId: number,
    slug: string,
  ): Promise<DeleteResult> {
    const article = await this.findArticleBySlug(slug);

    if (article.author.id !== userId) {
      throw new HttpException('You are not an author!', HttpStatus.FORBIDDEN);
    }

    return await this.articleRepository.delete({ slug });
  }

  public async addArticleToFavorites(
    userId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.findArticleBySlug(slug);
    const user = await this.userRepository.findOne(userId, {
      relations: ['favorites'],
    });

    const isFavorited =
      user.favorites.findIndex((favorite) => favorite.id === article.id) !== -1;

    if (!isFavorited) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  public async removeArticleFromFavorites(
    userId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.findArticleBySlug(slug);
    const user = await this.userRepository.findOne(userId, {
      relations: ['favorites'],
    });

    const isFavorited =
      user.favorites.findIndex((favorite) => favorite.id === article.id) !== -1;

    if (isFavorited) {
      user.favorites = user.favorites.filter(
        (favorite) => favorite.id !== article.id,
      );
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  public buildArticleResponse(
    article: ArticleEntity,
  ): ArticleResponseInterface {
    return { article };
  }
}
