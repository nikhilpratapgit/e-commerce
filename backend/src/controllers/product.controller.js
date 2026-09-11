import prisma from "../config/prisma.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      images,
      categoryId
    } = req.body;

    // Validate required fields
    if (!name || !description || price === undefined || !categoryId) {
      return res.status(400).json({
        message: "Name, description, price and categoryId are required"
      });
    }

    // Check whether category exists
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        isActive: true
      }
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock: stock || 0,
        images: images || [],
        categoryId
      }
    });

    return res.status(201).json({
      message: "Product created successfully",
      product
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create product"
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id,
        isActive: true
      }
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.status(200).json({
      product
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch product"
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      categoryId,
      minPrice,
      maxPrice,
      minRating,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10
    } = req.query;

    // Convert query parameters to numbers
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (pageNumber - 1) * limitNumber;

    // Build filters
    const where = {
      isActive: true
    };

    // Search by product name
    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive"
      };
    }

    // Filter by category
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Price filter
    if (minPrice || maxPrice) {
      where.price = {};

      if (minPrice) {
        where.price.gte = Number(minPrice);
      }

      if (maxPrice) {
        where.price.lte = Number(maxPrice);
      }
    }

    // Rating filter
    if (minRating) {
      where.ratingAverage = {
        gte: Number(minRating)
      };
    }

    // Allowed sorting fields
    const allowedSortFields = [
      "price",
      "ratingAverage",
      "createdAt",
      "name"
    ];

    const finalSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const finalOrder = order === "asc" ? "asc" : "desc";

    // Get products and total count
    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          [finalSortBy]: finalOrder
        }
      }),

      prisma.product.count({
        where
      })
    ]);

    const totalPages = Math.ceil(totalProducts / limitNumber);

    return res.status(200).json({
      products,

      pagination: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalProducts,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1
      }
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch products"
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      stock,
      images,
      categoryId
    } = req.body;

    // Check whether product exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        isActive: true
      }
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // If categoryId is provided, check category
    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          isActive: true
        }
      });

      if (!category) {
        return res.status(404).json({
          message: "Category not found"
        });
      }
    }

    const product = await prisma.product.update({
      where: {
        id
      },
      data: {
        name,
        description,
        price,
        stock,
        images,
        categoryId
      }
    });

    return res.status(200).json({
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update product"
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check whether product exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        isActive: true
      }
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const product = await prisma.product.update({
      where: {
        id
      },
      data: {
        isActive: false,
        archivedAt: new Date()
      }
    });

    return res.status(200).json({
      message: "Product deleted successfully",
      product
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete product"
    });
  }
};