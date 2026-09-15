import prisma from "../config/prisma.js";

// Create order from cart
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        message: "Shipping address is required"
      });
    }

    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      country
    } = shippingAddress;

    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !country
    ) {
      return res.status(400).json({
        message: "Complete shipping address is required"
      });
    }

    // Find user's cart
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

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    // Check stock and calculate total
    let totalAmount = 0;

    for (const item of cart.items) {
      if (!item.product.isActive) {
        return res.status(400).json({
          message: `${item.product.name} is no longer available`
        });
      }

      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name}`
        });
      }

      totalAmount += item.product.price * item.quantity;
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Create order
    const order = await prisma.order.create({
      
      data: {
        orderNumber,
        userId,
        totalAmount,
        shippingAddress: {
          fullName,
          phone,
          address,
          city,
          state,
          pincode,
          country
        },
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Reduce product stock
    for (const item of cart.items) {
      await prisma.product.update({
        where: {
          id: item.productId
        },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id
      }
    });

    return res.status(201).json({
      message: "Order created successfully",
      order
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create order"
    });
  }
};


// Get current user's orders
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: {
        userId
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({
      orders
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch orders"
    });
  }
};


// Get one order belonging to current user
export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id,
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

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    return res.status(200).json({
      order
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch order"
    });
  }
};


// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({
      orders
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch orders"
    });
  }
};


// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED"
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    const existingOrder = await prisma.order.findUnique({
      where: {
        id
      }
    });

    if (!existingOrder) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    const order = await prisma.order.update({
      where: {
        id
      },
      data: {
        status
      }
    });

    return res.status(200).json({
      message: "Order status updated successfully",
      order
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update order status"
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderId = req.params.id;

    const result = await prisma.$transaction(async (tx) => {

      // Find the order belonging to the logged-in user
      const order = await tx.order.findFirst({
        where: {
          id: orderId,
          userId
        },
        include: {
          items: true
        }
      });

      if (!order) {
        throw new Error("ORDER_NOT_FOUND");
      }

      // Already cancelled
      if (order.status === "CANCELLED") {
        throw new Error("ORDER_ALREADY_CANCELLED");
      }

      // Cannot cancel after shipping
      if (
        order.status === "SHIPPED" ||
        order.status === "DELIVERED"
      ) {
        throw new Error("ORDER_CANNOT_BE_CANCELLED");
      }

      // Restore stock for every product
      for (const item of order.items) {
        await tx.product.update({
          where: {
            id: item.productId
          },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });
      }

      // Change order status
      const updatedOrder = await tx.order.update({
        where: {
          id: orderId
        },
        data: {
          status: "CANCELLED"
        }
      });

      return updatedOrder;
    });

    return res.status(200).json({
      message: "Order cancelled successfully",
      order: result
    });

  } catch (error) {
    console.error(error);

    if (error.message === "ORDER_NOT_FOUND") {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (error.message === "ORDER_ALREADY_CANCELLED") {
      return res.status(400).json({
        message: "Order is already cancelled"
      });
    }

    if (error.message === "ORDER_CANNOT_BE_CANCELLED") {
      return res.status(400).json({
        message: "Order cannot be cancelled at this stage"
      });
    }

    return res.status(500).json({
      message: "Failed to cancel order"
    });
  }
};