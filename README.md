# Blog Platform API

A scalable and robust RESTful API for a blog platform built with [NestJS](https://nestjs.com/), [Drizzle ORM](https://orm.drizzle.team/), and PostgreSQL.

## 🚀 Features

- **🔐 Authentication & Authorization**:
  - JWT-based authentication
  - Role-Based Access Control (Admin, Author, Reader)
  - Account verification via email
  - Password reset flows
- **👥 User Management**:
  - Public & Private profiles
  - Avatar uploads (Cloudinary)
  - Admin dashboard stats
- **📝 Content Management**:
  - **Posts**: Rich CRUD operations, Cover images, Full-text Search over titles/content.
  - **Taxonomy**: Categories and Tags management.
  - **Status**: Draft, Published, Archived workflows.
- **💬 Engagement**:
  - **Comments**: Nested/Threaded comments system.
  - **Reactions**: Like system for Posts and Comments.
  - **Bookmarks**: Save posts for later.
  - **Views**: Track post view counts.
- **📢 Communication**:
  - **Newsletters**: Subscription management and email handling.
  - **Contact Form**: Direct inquiries sent to admins via email.
- **🛡️ Moderation**:
  - Report system for Posts, Comments, and Users.
- **⚙️ Technical Features**:
  - **Media**: Optimized image uploads via Cloudinary.
  - **Security**: Helmet, Rate Limiting (Throttler), Compression.
  - **Docs**: Interactive API documentation via Scalar.

## 🛠️ Tech Stack

- **Framework**: [NestJS 11](https://nestjs.com/)
- **Language**: TypeScript
- **Database**: PostgreSQL (NeonDB recommended)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Mail**: Nodemailer
- **Storage**: Cloudinary
- **Documentation**: @scalar/nestjs-api-reference
- **Package Manager**: pnpm

## � Project Structure

```bash
src/
├── common/             # Shared guards, decorators, filters, types
│   ├── decorators/     # Custom decorators (@CurrentUser, @Roles)
│   ├── guards/         # Auth & Roles guards
│   ├── swagger/        # Swagger/Scalar configuration
│   └── ...
├── database/           # Drizzle ORM configuration
│   ├── migrations/     # SQL migration files
│   └── schema/         # Database schema definitions
├── modules/            # Feature modules
│   ├── auth/           # Authentication & Account verification
│   ├── posts/          # Blog posts logic
│   ├── users/          # User management
│   ├── comments/       # Commenting system
│   ├── mail/           # Email service (Nodemailer)
│   └── ...
├── app.module.ts       # Main application module
└── main.ts             # Application entry point
```

## 🔐 Role-Based Access Control (RBAC)

The system supports three user roles with hierarchical permissions:

- **👑 Admin (`admin`)**:
  - Full system access.
  - Manage all Users, Posts, Comments, Categories, and Tags.
  - View System Stats and Reports.
  - Manage Newsletters.
- **✍️ Author (`author`)**:
  - Create and Manage their own Posts.
  - Upload media.
  - Manage comments on their posts.
- **📖 Reader (`reader`)** (Default):
  - Read posts and comments.
  - Comment on posts.
  - Bookmark posts.
  - Like/React to content.
  - Report content.

## �📋 Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/)

## ⚙️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/misbahul-alam/blog-platform-api.git
   cd blog-platform-api
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure environment variables:

   Copy the example file to create your own configuration:

   ```bash
   cp .env.example .env
   ```

   **Configuration Reference:**

   | Variable                | Description                        | Example                          |
   | ----------------------- | ---------------------------------- | -------------------------------- |
   | `PORT`                  | Application port                   | `3000`                           |
   | `NODE_ENV`              | Environment mode                   | `development` / `production`     |
   | `FRONTEND_URL`          | Frontend App URL (for email links) | `http://localhost:3000`          |
   | `DATABASE_URL`          | PostgreSQL connection string       | `postgresql://user:pass@host/db` |
   | `JWT_SECRET`            | Secret key for signing tokens      | `supersecr3t`                    |
   | `CLOUDINARY_NAME`       | Cloudinary Cloud Name              | `my-cloud`                       |
   | `CLOUDINARY_API_KEY`    | Cloudinary API Key                 | `123456...`                      |
   | `CLOUDINARY_API_SECRET` | Cloudinary Secret                  | `abcde...`                       |
   | `SMTP_HOST`             | Mail server host                   | `smtp.gmail.com`                 |
   | `SMTP_USER`             | Mail server username               | `user@gmail.com`                 |
   | `SMTP_PASS`             | Mail server password               | `app-specific-password`          |

## 🗄️ Database Setup

This project uses Drizzle ORM for database management.

1. **Generate Migrations**:

   ```bash
   pnpm run drizzle:generate
   ```

2. **Run Migrations**:

   ```bash
   pnpm run drizzle:migrate
   ```

   _Applies the generated SQL changes to your connected database._

3. **Seed Database** (Optional):
   ```bash
   pnpm run drizzle:seed
   ```

## ▶️ Running the Application

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# production mode
pnpm run start:prod
```

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation at:

```
http://localhost:3000/docs
```

The documentation is powered by Scalar and provides a comprehensive view of all endpoints, schemas, and authentication methods.

## 🧪 Testing

```bash
# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# test coverage
pnpm run test:cov
```

## ❓ Troubleshooting

**Migration Conflicts:**
If you encounter `relation "table" already exists` errors during migration:

1. Ensure your local DB is clean or matches the migration state.
2. Use `pnpm run drizzle:push` to sync without creating a migration file if in early dev.

**Scalar Docs White Screen:**
Ensure `helmet` content security policy is correctly configured to allow inline scripts, or disabled for the docs path. This project already handles this in `main.ts`.

## 📄 License

This project is licensed under the **MIT License**.
