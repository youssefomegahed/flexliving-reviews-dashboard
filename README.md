# Flex Living Reviews Dashboard

A modern web application for managing and analyzing guest reviews across Flex Living properties. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Review Management**: View, filter, sort, and approve/unapprove guest reviews
- **Analytics Dashboard**: KPI cards showing total reviews, average ratings, and approval status
- **Trend Visualization**: Interactive charts displaying rating trends over time
- **Advanced Filtering**: Filter by property name, rating range, channel, category, and date range
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Live data synchronization with loading states

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom theme
- **Database**: SQLite with Prisma ORM
- **State Management**: TanStack Query (React Query)
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up environment variables:

   Create a `.env` file with:

   ```env
   DATABASE_URL="file:./dev.db"
   ```


4. Set up the database:

   ```bash
   yarn prisma db push
   yarn prisma db seed
   ```

5. Start the development server:

   ```bash
   yarn dev
   ```

The application will be available at `http://localhost:3000`.

## Project Structure

```text
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   └── reviews/       # Review management endpoints
│   ├── reviews-display/   # Public reviews display page
│   └── page.tsx          # Main dashboard
├── components/            # React components
│   └── dashboard/        # Dashboard-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── types/                # TypeScript type definitions
└── providers/            # React context providers
```

## API Endpoints

- `GET /api/reviews/hostaway` - Fetch reviews with filtering and pagination
- `POST /api/reviews/approve` - Approve/unapprove a review

## Database Schema

The application uses a SQLite database with the following main models:

- **Review**: Stores review data including text, rating, status, and metadata
- **ReviewCategory**: Stores category-specific ratings for each review

## Key Components

- **DashboardHeader**: Main titles and branding
- **KpiGrid**: Key performance indicator cards
- **TrendChart**: Rating trend visualization
- **ReviewsTable**: Review management interface
- **FiltersPanel**: Advanced filtering controls
- **Pagination**: Data pagination controls

## Development

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier
- `yarn db:seed` - Seed database with sample data

### Database Management

- `yarn prisma db push` - Push schema changes to database
- `yarn prisma db seed` - Seed database with sample data
- `yarn prisma studio` - Open Prisma Studio for database management

## Hostaway API Integration

The application includes mock integration with the Hostaway API for future real-time data synchronization. The integration attempts to fetch reviews from the Hostaway API using OAuth2 authentication.

## Styling

The application uses Tailwind CSS v4 with a custom theme defined in `globals.css`. The primary color scheme uses Flex Living branding colors:

- Primary: `#284f4d` (flexPrimary)
- Background: `#fffdf5` (flexBg)
- Text: `#333333` (flexText)