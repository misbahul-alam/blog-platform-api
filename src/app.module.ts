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
import { MailModule } from './modules/mail/mail.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { NewslettersModule } from './modules/newsletters/newsletters.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    DatabaseModule,
    AuthModule,
    PostsModule,
    CategoriesModule,
    BookmarksModule,
    UsersModule,
    CommentsModule,
    CloudinaryModule,
    TagsModule,
    MailModule,
    NewslettersModule,
    ReportsModule,
    ContactModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
