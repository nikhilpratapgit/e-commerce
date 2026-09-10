import prisma from "../config/prisma.js";

// Get current user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await prisma.cart.findUnique({
      where: {
        userId
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart) {
      return res.status(200).json({
        cart: {
          items: []
        }
      });
    }

    return res.status(200).json({
      cart
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch cart"
    });
  }
};


// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Product ID and quantity are required"
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0"
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

    // Check stock
    if (quantity > product.stock) {
      return res.status(400).json({
        message: "Insufficient stock"
      });
    }

    // Find user's cart
    let cart = await prisma.cart.findUnique({
      where: {
        userId
      }
    });

    // Create cart if user doesn't have one
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId
        }
      });
    }

    // Check whether product already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });

    let cartItem;

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: "Requested quantity exceeds available stock"
        });
      }

      cartItem = await prisma.cartItem.update({
        where: {
          id: existingItem.id
        },
        data: {
          quantity: newQuantity
        }
      });

    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      });
    }

    return res.status(201).json({
      message: "Product added to cart",
      cartItem
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to add product to cart"
    });
  }
};


// Update product quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0"
      });
    }

    // Find user's cart
    const cart = await prisma.cart.findUnique({
      where: {
        userId
      }
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    // Find product
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

    // Check stock
    if (quantity > product.stock) {
      return res.status(400).json({
        message: "Insufficient stock"
      });
    }

    // Find cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Product is not in cart"
      });
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: cartItem.id
      },
      data: {
        quantity
      }
    });

    return res.status(200).json({
      message: "Cart item updated successfully",
      cartItem: updatedItem
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update cart item"
    });
  }
};


// Remove product from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    // Find user's cart
    const cart = await prisma.cart.findUnique({
      where: {
        userId
      }
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    // Find cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Product is not in cart"
      });
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItem.id
      }
    });

    return res.status(200).json({
      message: "Product removed from cart"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to remove product from cart"
    });
  }
};


// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await prisma.cart.findUnique({
      where: {
        userId
      }
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id
      }
    });

    return res.status(200).json({
      message: "Cart cleared successfully"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to clear cart"
    });
  }
};