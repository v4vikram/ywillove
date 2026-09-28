export type Review = {
  id: string;
  rating: number;
  body: string | null;
  createdAt: string;
  user: { id: string; name: string };
};

// The recent-reviews endpoint also joins the product, so the wall can link to it.
export type RecentReview = Review & {
  product: { id: string; title: string; slug: string };
};

export type ProductReviews = {
  reviews: Review[];
  average: number;
  count: number;
};
