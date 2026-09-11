import prisma from "../config/prisma.js";

// GET all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc"
      }
    });

    return res.status(200).json({
      categories
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch categories"
    });
  }
};


// GET single category
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const category = await prisma.category.findFirst({
      where: {
        id,
        isActive: true,
      }
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    return res.status(200).json({
      category
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch category"
    });
  }
};


// CREATE category
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required"
      });
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        name
      }
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists"
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description
      }
    });

    return res.status(201).json({
      message: "Category created successfully",
      category
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create category"
    });
  }
};


// UPDATE category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
      }
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    const category = await prisma.category.update({
      where: {
        id
      },
      data: {
        name,
        description
      }
    });

    return res.status(200).json({
      message: "Category updated successfully",
      category
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update category"
    });
  }
};


// DELETE category (soft delete)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
      }
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    const category = await prisma.category.update({
      where: {
        id
      },
      data: {
        isActive: false,
        archivedAt: new Date()
      }
    });

    return res.status(200).json({
      message: "Category deleted successfully",
      category
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete category"
    });
  }
};

