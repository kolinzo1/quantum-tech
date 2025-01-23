# Quantum Q&A

A forum application for discussing quantum physics and mechanics.

## Features

- User authentication
- Category-based discussions
- Question and answer functionality
- Markdown support for scientific notation

## Technologies

- Frontend: React, Bootstrap
- Backend: Node.js, Express
- Database: MySQL

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)

### Setup Database

1. Create MySQL database
2. Run schema from `database/schema.sql`

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials
npm start
```
