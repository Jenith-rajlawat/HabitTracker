# Habit Tracker

A full-stack habit tracker built with React, Spring Boot, and Supabase PostgreSQL.

## Features

- Add habits
- Complete habits
- XP tracking
- Streak tracking
- Disable completion after habit is done for the day
- Delete habits
- Persistent database storage

## Tech Stack

- React + Vite
- Spring Boot
- Spring Data JPA
- Supabase PostgreSQL
- CSS

## API Endpoints

GET /api/habits  
POST /api/habits  
PUT /api/habits/{id}/complete  
DELETE /api/habits/{id}

## How to Run

### Backend

Create `application.properties` from `application-example.properties`.

Then run the Spring Boot app.

### Frontend

Create `.env` from `.env.example`.

```bash
npm install
npm run dev
