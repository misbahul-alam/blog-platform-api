# Blog Platform API

A scalable and robust RESTful API for a blog platform built with [NestJS](https://nestjs.com/), [Drizzle ORM](https://orm.drizzle.team/), and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with Role-Based Access Control (RBAC).
- **User Management**: User registration, profile management.
- **Blog Posts**: Create, read, update, and delete posts with tags and categories.
- **Comments**: Commenting system for posts.
- **Bookmarks**: Bookmark favorite posts.
- **Categories & Tags**: Organize content efficiently.
- **Media Upload**: Image upload support using Cloudinary.
- **Pagination**: Efficient data retrieval with pagination support.
- **API Documentation**: Interactive API docs using Scalar/Swagger.

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger & Scalar
- **Package Manager**: pnpm

## 📋 Prerequisites

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
   Create a `.env` file in the root directory and add the following:

   ```env
   PORT=3000
   DATABASE_URL=
   JWT_SECRET=

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```

## 🗄️ Database Setup

This project uses Drizzle ORM for database management.

1. **Generate Migrations**:

   ```bash
   pnpm run drizzle:generate
   ```

2. **Run Migrations**:

   ```bash
   pnpm run drrizzle:migrate
   ```

   _(Note: Check `package.json` for the exact script name, it appears as `drrizzle:migrate` currently)_

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

The API is globally prefixed with `/api/v1`.

## 🧪 Testing

```bash
# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# test coverage
pnpm run test:cov
```
