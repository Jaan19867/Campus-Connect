# Resume Manager

A full-stack application built with Next.js TypeScript frontend and NestJS backend.

## Project Structure

```
Resume-Manager/
├── frontend/          # Next.js TypeScript application
├── backend/           # NestJS application
├── package.json       # Root package.json with scripts
└── README.md          # This file
```

## Prerequisites

- Node.js (v16 or higher)
- npm

## Setup

1. **Install dependencies for all projects:**
   ```bash
   npm run install:all
   ```

   Or manually:
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend && npm install
   
   # Install backend dependencies
   cd ../backend && npm install
   ```

## Development

### Run both frontend and backend concurrently:
```bash
npm run dev
```

### Run individually:

**Frontend only:**
```bash
npm run dev:frontend
```
- Runs on: http://localhost:3002

**Backend only:**
```bash
npm run dev:backend
```
- Runs on: http://localhost:3006

## Build

### Build both projects:
```bash
npm run build
```

### Build individually:
```bash
npm run build:frontend
npm run build:backend
```

## Production

```bash
npm start
```

## Technologies Used

### Frontend
- Next.js 14 (latest)
- React 18
- TypeScript
- Tailwind CSS
- ESLint

### Backend
- NestJS
- TypeScript
- Express.js (under the hood)

## API Documentation

Once the backend is running, you can access:
- API endpoints: http://localhost:3006
- API documentation: http://localhost:3006/api (if Swagger is configured)

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test both frontend and backend
4. Submit a pull request 