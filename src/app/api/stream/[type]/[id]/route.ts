import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const params = await context.params;
    console.log("Stream API called with params:", params);
    
    // Get session first
    const session = await getServerSession(authOptions);
    console.log("Session:", session);
    
    // Check authentication
    if (!session?.user?.id) {
      console.log("No session or user ID found");
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    // Get params from context
    const { type, id } = params;
    console.log("Processing request for:", { type, id });

    // Validate media type
    if (!["movie", "tv"].includes(type)) {
      console.log("Invalid media type:", type);
      return NextResponse.json(
        { error: "Invalid media type" },
        { status: 400 }
      );
    }

    // Check TMDB API key
    const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!tmdbApiKey) {
      console.error("TMDB API key is not configured");
      return NextResponse.json(
        { error: "TMDB API key is not configured" },
        { status: 500 }
      );
    }

    // Get media details from TMDB
    const tmdbUrl = `https://api.themoviedb.org/3/${type}/${id}?api_key=${tmdbApiKey}`;
    console.log("Fetching from TMDB:", tmdbUrl);
    
    const tmdbResponse = await fetch(tmdbUrl);
    if (!tmdbResponse.ok) {
      throw new Error(`TMDB API error: ${tmdbResponse.statusText}`);
    }

    const mediaData = await tmdbResponse.json();

    // Log the stream request in Firestore
    await db.collection('stream_logs').add({
      userId: session.user.id,
      mediaType: type,
      mediaId: id,
      mediaTitle: mediaData.title || mediaData.name,
      timestamp: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    // Update user's watch history in Firestore
    const userRef = db.collection('users').doc(session.user.id);
    await userRef.update({
      watchHistory: {
        [type]: {
          [id]: {
            lastWatched: new Date(),
            title: mediaData.title || mediaData.name,
            posterPath: mediaData.poster_path
          }
        }
      }
    });

    // Return video sources (placeholder)
    return NextResponse.json({
      sources: [
        {
          url: `https://example.com/stream/${type}/${id}/source1`,
          quality: "1080p",
          type: "video/mp4",
        },
        {
          url: `https://example.com/stream/${type}/${id}/source2`,
          quality: "720p",
          type: "video/mp4",
        },
      ],
      mediaInfo: mediaData,
    });
  } catch (error) {
    console.error("Stream API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
} 