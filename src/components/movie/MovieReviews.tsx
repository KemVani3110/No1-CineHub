import { TMDBReviews } from "@/types/tmdb";
import { Star } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/services/tmdb";

interface MovieReviewsProps {
  reviews: TMDBReviews;
}

export default function MovieReviews({ reviews }: MovieReviewsProps) {
  if (!reviews.results.length) {
    return (
      <div className="text-center py-8">
        <p className="text-text-sub">No reviews available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.results.map((review) => (
        <div key={review.id} className="bg-bg-card rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={
                  review.author_details.avatar_path
                    ? getImageUrl(review.author_details.avatar_path.slice(1))
                    : "/images/no-profile.jpg"
                }
                alt={review.author}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-medium text-text-main">{review.author}</h4>
              {review.author_details.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-text-sub">
                    {review.author_details.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
          <p className="text-text-sub leading-relaxed">{review.content}</p>
        </div>
      ))}
    </div>
  );
}
