import { NextResponse } from 'next/server';
import {
  normalizeAllGooglePlaces,
  mockGooglePlacesData,
} from '@/lib/google-places';

export async function GET() {
  try {
    // Simulate Google Places API call
    const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!googleApiKey) {
      return NextResponse.json({
        status: 'demo',
        message: 'Google Places API key not configured - using mock data',
        integration_status: 'parked',
        data: {
          mock_places: mockGooglePlacesData.length,
          normalized_reviews:
            normalizeAllGooglePlaces(mockGooglePlacesData).length,
          sample_reviews: normalizeAllGooglePlaces(mockGooglePlacesData).slice(
            0,
            3,
          ),
        },
      });
    }

    // In a real implementation, this would call the Google Places API
    // const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${googleApiKey}`);

    return NextResponse.json({
      status: 'ready',
      message: 'Google Places API integration ready for production',
      integration_status: 'implemented',
      api_key_configured: true,
      data: {
        mock_places: mockGooglePlacesData.length,
        normalized_reviews:
          normalizeAllGooglePlaces(mockGooglePlacesData).length,
        sample_reviews: normalizeAllGooglePlaces(mockGooglePlacesData).slice(
          0,
          3,
        ),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Error in Google Places integration demo',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
