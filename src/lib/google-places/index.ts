/**
 * Google Places API Integration Module
 *
 * This module contains the implementation for integrating with Google Places API
 * to fetch and normalize Google Reviews. The integration is currently in a
 * "parked" state - implemented but not actively used in the main application.
 *
 * Status: EXPLORATION COMPLETE - Ready for production integration when needed
 *
 * Features Implemented:
 * - Mock Google Places API data structure
 * - Data normalization and category rating generation
 * - Integration with existing review management system
 * - Proper error handling and logging
 *
 * To activate this integration:
 * 1. Add GOOGLE_PLACES_API_KEY to environment variables
 * 2. Import and use the functions in the main API route
 * 3. Update the database seeding to include Google reviews
 */

export { normalizeGooglePlaces, normalizeAllGooglePlaces } from './normalize';
export { mockGooglePlacesData } from './mock-data';
export type { GooglePlace, GoogleReview } from './types';

// Re-export for convenience
export * from './normalize';
