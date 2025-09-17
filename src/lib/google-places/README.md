# Google Places API Integration

This module contains a mock implementation for integrating with Google Places API to fetch and normalize Google Reviews. The integration is currently in a "parked" state - fully implemented but not actively used in the main application.

## What's Implemented

### 1. Data Normalization (`normalize.ts`)

- Converts Google Places API format to application review schema
- Generates intelligent category ratings based on review content analysis
- Handles unique ID generation and timestamp conversion
- Supports multiple Google Places locations

### 2. Mock Data (`mock-data.json` + `mock-data.ts`)

- Realistic Google Places review data structure
- 4 different Flex Living properties with multiple reviews
- 13 total Google reviews with varied ratings and detailed feedback
- Authentic review content and metadata

### 3. TypeScript Types (`types.ts`)

- Complete type definitions for Google Places API
- Proper interfaces for places, reviews, and API responses
- Error handling types

### 4. Demo Endpoint (`/api/demo/google-places`)

- Showcases the integration capabilities
- Demonstrates data normalization
- Shows integration status and configuration

## File Structure

```text
src/lib/google-places/
├── README.md              # This documentation
├── index.ts              # Main module exports
├── types.ts              # TypeScript type definitions
├── normalize.ts          # Data normalization functions
├── mock-data.json        # Mock Google Places data
└── mock-data.ts          # Mock data exports
```

## Usage

### Basic Integration

```typescript
import {
  normalizeAllGooglePlaces,
  mockGooglePlacesData,
} from '@/lib/google-places';

// Normalize mock data
const normalizedReviews = normalizeAllGooglePlaces(mockGooglePlacesData);

// In production, replace mock data with real API calls
const googlePlacesResponse = await fetch(
  'https://maps.googleapis.com/maps/api/place/details/json?...',
);
const places = await googlePlacesResponse.json();
const reviews = normalizeAllGooglePlaces(places);
```

### Demo Endpoint

Visit `/api/demo/google-places` to see the integration in action.

## Integration Features

### Smart Category Rating Generation

The normalization function analyzes review text to generate category-specific ratings:

- **Cleanliness**: Detects keywords like "clean", "spotless", "dirty", "messy"
- **Communication**: Identifies "responsive", "helpful", "unresponsive"
- **Location**: Recognizes "perfect location", "convenient", "noisy"
- **Value**: Finds "great value", "worth it", "expensive"
- **Accuracy**: Spots "exactly as described", "misleading"
- **Check-in**: Detects "smooth check-in", "difficult check-in"

### Data Structure Mapping

- Google Places `place_id` → Application `listingId`
- Google `rating` (1-5) → Application `rating`
- Google `time` (Unix timestamp) → Application `createdAt` (ISO string)
- Google `author_name` → Application `authorName`
