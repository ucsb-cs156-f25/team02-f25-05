const menuItemReviewsFixtures = {
  oneReview: {
    id: 1,
    reviewerEmail: "test@example.com",
    stars: 5,
    dateReviewed: "2025-01-02T12:00:00",
    comments: "Very good",
  },
  threeReviews: [
    {
      id: 1,
      reviewerEmail: "test@example.com",
      stars: 5,
      dateReviewed: "2025-01-02T12:00:00",
      comments: "Very good",
    },
    {
      id: 2,
      reviewerEmail: "test1smith@example.com",
      stars: 3,
      dateReviewed: "2025-04-03T18:30:00",
      comments: "alright",
    },
    {
      id: 3,
      reviewerEmail: "test2@example.com",
      stars: 1,
      dateReviewed: "2025-07-04T14:15:00",
      comments: "bad.",
    },
  ],
};

export { menuItemReviewsFixtures };

