import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { UsersModule } from './modules/users/users.module';
import { CommentsModule } from './modules/comments/comments.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { TagsModule } from './modules/tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    PostsModule,
    CategoriesModule,
    BookmarksModule,
    UsersModule,
    CommentsModule,
    CloudinaryModule,
    TagsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
