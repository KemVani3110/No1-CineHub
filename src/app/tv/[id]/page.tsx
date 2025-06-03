'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchTVShowDetails } from '@/services/tmdb';
import { TMDBTVDetails } from '@/types/tmdb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Loading from '@/components/common/Loading';
import {
  TVShowOverview,
  TVShowCast,
  TVShowReviews,
  TVShowSeasons,
  TVShowMedia,
  SimilarTVShows,
} from '@/components/lazy';

export default function TVShowDetail() {
  const { id } = useParams();
  const [tvShow, setTVShow] = useState<TMDBTVDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTVShow = async () => {
      try {
        const data = await fetchTVShowDetails(Number(id));
        setTVShow(data);
      } catch (error) {
        console.error('Error loading TV show:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTVShow();
  }, [id]);

  if (loading) {
    return <Loading message="Loading TV show details..." />;
  }

  if (!tvShow) {
    return <div>TV show not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 gap-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cast">Cast</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="seasons">Seasons</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="similar">Similar Shows</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <TVShowOverview tvShow={tvShow} />
        </TabsContent>

        <TabsContent value="cast">
          {tvShow.credits && <TVShowCast credits={tvShow.credits} />}
        </TabsContent>

        <TabsContent value="reviews">
          {tvShow.reviews && <TVShowReviews reviews={tvShow.reviews} />}
        </TabsContent>

        <TabsContent value="seasons">
          <TVShowSeasons seasons={tvShow.seasons} tvShowId={tvShow.id} />
        </TabsContent>

        <TabsContent value="media">
          {tvShow.videos && <TVShowMedia videos={tvShow.videos} />}
        </TabsContent>

        <TabsContent value="similar">
          {tvShow.similar && <SimilarTVShows similarShows={tvShow.similar} />}
        </TabsContent>
      </Tabs>
    </div>
  );
} 