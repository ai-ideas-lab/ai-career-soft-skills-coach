# AI Career Soft Skills Coach

An AI-powered platform for career soft skills training and coaching.

## Features

- AI-powered scenario-based soft skills training
- Personalized coaching and feedback
- Progress tracking and analytics
- Interactive dialogue simulation
- Multi-modal learning experience

## Tech Stack

- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + Prisma
- AI: OpenAI API
- Frontend: React + TypeScript
- Authentication: JWT
- Cache: Redis

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Set up database:
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── controllers/     # Request handlers
├── middleware/     # Express middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
└── types/          # TypeScript type definitions
```

## API Endpoints

- `/api/auth/*` - Authentication endpoints
- `/api/users/*` - User management
- `/api/scenarios/*` - Scenario management
- `/api/sessions/*` - Training sessions
- `/api/feedback/*` - Feedback and analytics

## Development

### Adding New Scenarios

1. Create scenario in database using Prisma
2. Implement scenario logic in services
3. Add API endpoints for scenario management
4. Create frontend components for scenario interaction

### Testing

```bash
npm test
npm run type-check
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT