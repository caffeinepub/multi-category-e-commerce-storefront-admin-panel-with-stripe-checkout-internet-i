import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useSubmitReview } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { Review } from '../../backend';

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
}

export default function ReviewSection({ productId, reviews }: ReviewSectionProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const submitReview = useSubmitReview();
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    try {
      await submitReview.mutateAsync({ productId, rating, comment: comment.trim() });
      toast.success('Review submitted!');
      setComment('');
      setRating(5);
    } catch (error) {
      toast.error('Failed to submit review');
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Submit Review Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8 p-6 border rounded-lg">
          <h3 className="font-semibold mb-4">Write a Review</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 cursor-pointer ${i < rating ? 'fill-warning text-warning' : 'text-muted'}`}
                  onClick={() => setRating(i + 1)}
                />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Comment</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
            />
          </div>
          <Button type="submit" disabled={submitReview.isPending}>
            {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      ) : (
        <div className="mb-8 p-6 border rounded-lg text-center">
          <p className="text-muted-foreground">Please login to write a review</p>
        </div>
      )}

      <Separator className="my-8" />

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="border-b pb-6 last:border-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Number(review.rating) ? 'fill-warning text-warning' : 'text-muted'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">by {review.userId.slice(0, 8)}...</span>
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
