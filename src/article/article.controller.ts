import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { CreateArticleDto, UpdateArticleDto } from './dtos';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { ArticleResponseInterface, ArticlesResponseInterface } from './types';
import { DeleteResult } from 'typeorm';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';

@Controller('/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @UseGuards(AuthGuard)
  public async findAllArticles(
    @User('id') userid: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.findAllArticles(userid, query);
  }

  @Get('/feed')
  @UseGuards(AuthGuard)
  public async getFeed(
    @User('id') userId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.getFeed(userId, query);
  }

  @Get('/:slug')
  @UseGuards(AuthGuard)
  public async findArticleBySlug(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findArticleBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  public async createArticle(
    @User() user: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      user,
      createArticleDto,
    );

    return this.articleService.buildArticleResponse(article);
  }

  @Put('/:slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  public async updateArticleBySlug(
    @User('id') userId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.updateArticleBySlug(
      userId,
      slug,
      updateArticleDto,
    );

    return this.articleService.buildArticleResponse(article);
  }

  @Delete('/:slug')
  @UseGuards(AuthGuard)
  public async deleteArticleBySlug(
    @User('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<DeleteResult> {
    return this.articleService.deleteArticleBySlug(userId, slug);
  }

  @Post('/:slug/favorite')
  @UseGuards(AuthGuard)
  public async addArticleToFavorites(
    @User('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.addArticleToFavorites(
      userId,
      slug,
    );

    return this.articleService.buildArticleResponse(article);
  }

  @Delete('/:slug/favorite')
  @UseGuards(AuthGuard)
  public async removeArticleFromFavorites(
    @User('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.removeArticleFromFavorites(
      userId,
      slug,
    );

    return this.articleService.buildArticleResponse(article);
  }
}
