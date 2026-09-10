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
    const products = await prisma.product.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({
      products
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