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
   HOSTAWAY_ACCOUNT_ID=your_account_id
   HOSTAWAY_API_KEY=your_api_key
   HOSTAWAY_ACCESS_TOKEN=your_access_token
   GOOGLE_PLACES_API_KEY=your_google_places_api_key
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

## API Integrations

The application includes mock integrations with multiple review sources:

### Hostaway API Integration

Mock integration with the Hostaway API for future real-time data synchronization. The integration attempts to fetch reviews from the Hostaway API using OAuth2 authentication.

### Google Places API Integration (Exploration Complete)

**Status: PARKED - Ready for Production Integration**

Complete exploration and implementation of Google Places API integration for Google Reviews. The integration is fully implemented but parked in a dedicated module to demonstrate the exploration work.

**What's Implemented:**

- Complete data normalization system (`src/lib/google-places/`)
- Mock Google Places data with realistic review structure
- Smart category rating generation based on review content analysis
- Demo endpoint at `/api/demo/google-places` to showcase capabilities
- Full TypeScript type definitions and error handling

**Integration Features:**

- 13 mock Google reviews across 4 Flex Living properties
- Intelligent keyword-based category rating generation
- Proper data structure mapping from Google Places to application schema
- Production-ready architecture with comprehensive documentation

**To Activate:** Add `GOOGLE_PLACES_API_KEY` to environment variables and import the module in the main API route.

## Styling

The application uses Tailwind CSS v4 with a custom theme defined in `globals.css`. The primary color scheme uses Flex Living branding colors:

- Primary: `#284f4d` (flexPrimary)
- Background: `#fffdf5` (flexBg)
- Text: `#333333` (flexText)
