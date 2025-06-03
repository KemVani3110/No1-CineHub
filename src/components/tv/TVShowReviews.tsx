'use client';

import { TMDBReviews } from '@/types/tmdb';
import { Star } from 'lucide-react';

interface TVShowReviewsProps {
  reviews: TMDBReviews;
}

const TVShowReviews = ({ reviews }: TVShowReviewsProps) => {
  if (!reviews.results.length) {
    return (
      <div className="text-center py-8">
        <p className="text-text-sub">No reviews available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reviews</h2>
      <div className="space-y-6">
        {reviews.results.map((review) => (
          <div
            key={review.id}
            className="bg-card rounded-lg p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {review.author_details.avatar_path ? (
                    <img
                      src={review.author_details.avatar_path}
                      alt={review.author}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold">
                      {review.author[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{review.author}</h3>
                  <p className="text-sm text-text-sub">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {review.author_details.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{review.author_details.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <p className="text-text-sub leading-relaxed">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TVShowReviews; 