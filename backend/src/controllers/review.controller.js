import prisma from "../config/prisma.js";

// Create review
export const createReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { rating, comment } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    // Check product
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true
      }
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // Check whether user already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product"
      });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment
      }
    });

    // Update product rating
    const ratingStats = await prisma.review.aggregate({
      where: {
        productId
      },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    await prisma.product.update({
      where: {
        id: productId
      },
      data: {
        ratingAverage: ratingStats._avg.rating || 0,
        ratingCount: ratingStats._count.rating
      }
    });

    return res.status(201).json({
      message: "Review created successfully",
      review
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create review"
    });
  }
};


// Get reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: {
        productId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({
      reviews
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch reviews"
    });
  }
};


// Update review
export const updateReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    // Find user's review
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewId,
        userId,
        productId
      }
    });

    if (!existingReview) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    // Update review
    const review = await prisma.review.update({
      where: {
        id: reviewId
      },
      data: {
        rating,
        comment
      }
    });

    // Recalculate product rating
    const ratingStats = await prisma.review.aggregate({
      where: {
        productId
      },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    await prisma.product.update({
      where: {
        id: productId
      },
      data: {
        ratingAverage: ratingStats._avg.rating || 0,
        ratingCount: ratingStats._count.rating
      }
    });

    return res.status(200).json({
      message: "Review updated successfully",
      review
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update review"
    });
  }
};


// Delete review
export const deleteReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, reviewId } = req.params;

    // Find user's review
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewId,
        userId,
        productId
      }
    });

    if (!existingReview) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    // Delete review
    await prisma.review.delete({
      where: {
        id: reviewId
      }
    });

    // Recalculate product rating
    const ratingStats = await prisma.review.aggregate({
      where: {
        productId
      },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    await prisma.product.update({
      where: {
        id: productId
      },
      data: {
        ratingAverage: ratingStats._avg.rating || 0,
        ratingCount: ratingStats._count.rating
      }
    });

    return res.status(200).json({
      message: "Review deleted successfully"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete review"
    });
  }
};