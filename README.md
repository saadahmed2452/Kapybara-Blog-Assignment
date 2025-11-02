# Kapibara Blog Assessment

This project is a full Blog CMS system built using **Next.js 15 App Router**, **tRPC**, **Neon Postgres**, **Tailwind CSS**, and **React Server Components**.

This assignment demonstrates:
- Server Components + Client Components usage correctly in App Router
- CRUD for Posts
- CRUD for Categories
- Many-to-Many linking system between posts & categories
- Slug based dynamic routing
- Markdown Rendering support
- Full DB integration with Neon Postgres

---

## Features Implemented

### Posts
- Create New Post
- Edit Post
- Delete Post
- View Single Post
- List All Posts
- Markdown Content Support
- Assign Multiple Categories to a Post

### Categories
- Create New Category
- Edit Category
- Delete Category
- View all posts inside a category (category slug page)

### DB

Database Used → **Neon Postgres Cloud**  
Tables Implemented:

- `posts`
- `categories`
- `post_categories` (many to many pivot table)

Unique Constraint Added → prevents duplicate category mapping for same post.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI | Next.js 15 App Router |
| Server RPC | tRPC |
| Styling | TailwindCSS |
| Database | Neon Postgres |
| Markdown | react-markdown |

---

## Local Setup Instructions

```bash
npm install
npm run dev
