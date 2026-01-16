import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Blog Platform API')
    .setDescription(
      `
The Blog Platform API is a robust and scalable RESTful service built with NestJS and Drizzle ORM. 

### Key Features
- **Authentication**: JWT-based auth with role management (Admin, Author, User).
- **Users**: Profile management, avatar upload, and password security.
- **Posts**: Full CRUD for blog posts with tagging, categories, and cover images.
- **Engagement**: Comments system (nested), likes/reactions, and bookmarks.
- **Moderation**: Content reporting and admin tools.
- **Communication**: Newsletter subscriptions and contact forms.
- **Media**: Cloudinary integration for optimized image hosting.

## Authentication
This API uses **Bearer Token** authentication. 
1. Register or Login to get a token.
2. Use the \`Authorize\` button to set your token globally.
`,
    )
    .setVersion('1.0')
    .setContact(
      'Misbahul Alam',
      'https://github.com/misbahul-alam',
      'misbahulalam64@gmail.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your JWT token',
        in: 'header',
      },
      'token',
    )
    .addTag('Authentication', 'User registration, login, and verification')
    .addTag('Users', 'User profile and account management')
    .addTag('Posts', 'Blog posts creation and management')
    .addTag('Comments', 'Post comments and discussions')
    .addTag('Categories', 'Taxonomy management for posts')
    .addTag('Tags', 'Topic tagging system')
    .addTag('Bookmarks', 'Save posts for later reading')
    .addTag('Newsletters', 'Email subscription management')
    .addTag('Contact', 'Contact form submissions')
    .addTag('Reports', 'Content moderation and reporting')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/docs',
    apiReference({
      content: document,
      theme: 'purple',
      layout: 'modern',
    }),
  );
}
