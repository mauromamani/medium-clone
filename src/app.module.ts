import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ormconfig from '@app/ormconfig';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { AuthMiddleware } from '@app/user/middlewares/auth.middleware';
import { TagModule } from '@app/tag/tag.module';
import { UserModule } from '@app/user/user.module';
import { ArticleModule } from '@app/article/article.module';
import { ProfileModule } from '@app/profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TagModule,
    UserModule,
    ArticleModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // Este middleware estará disponible de manera global
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
