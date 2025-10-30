# Game List Management Application

## Overview

- [x] Built with Next.js, tRPC, Prisma, and MongoDB
- [x] Uses Zod for input validation
- [x] Displays a list of games in a paginated and sortable table
- [x] Handles large data efficiently with server-side filtering and sorting
- [x] API endpoints created with tRPC for type-safe communication
- [x] New game submissions supported, including dynamic developer creation if they do not exist
- [x] Data seeded with at least 1000 mock entries using Prisma seed
- [x] URL query parameters support filter and sort states for shareability
- [x] Project deployed on Vercel and source code available on GitHub

## Setup Instructions

- [x] Clone the repository
- [x] Run `npm install` or `yarn install` to install dependencies
- [x] Create `.env` file and add your MongoDB connection string
- [x] Execute `npx prisma migrate dev` to create database schema
- [x] Seed the database with `npx prisma db seed`
- [x] Run development server with `npm run dev` or `yarn dev`

## Optional / Future Improvements

- [ ] Authentication and role-based access with NextAuth
- [ ] Comprehensive test coverage for backend and frontend
- [ ] UI enhancements for better user experience
- [ ] Performance improvements and caching strategies for detail pages and endpoints

---
