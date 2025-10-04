import { NextResponse } from 'next/server';
import { podcasts } from '@/lib/mock-data'; // This path alias assumes your tsconfig.json is set up for it.
import { Podcast } from '@/lib/types'; // Import the Podcast type

// The GET function is the handler for GET requests to this endpoint
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const podcastId = params.id;

    // Find the specific podcast from our mock data
    // Add the 'Podcast' type to the parameter 'p' to fix the implicit 'any' error.
    const podcast = podcasts.find((p: Podcast) => p.id === podcastId);

    if (!podcast) {
      // If the podcast doesn't exist, return a 404 error
      return NextResponse.json({ message: 'Podcast not found' }, { status: 404 });
    }

    // If the podcast is found, return its episodes
    return NextResponse.json({
      success: true,
      count: podcast.episodes.length,
      data: podcast.episodes,
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

