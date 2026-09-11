import prisma from "../config/prisma.js";

export const getDashboard = async (req, res) => {
  try {
    // Total users
    const totalUsers = await prisma.user.count({
    //   where: {
    //     archivedAt: null
    //   }
    });

    // Total active products
    const totalProducts = await prisma.product.count({
      where: {
        isActive: true
      }
    });

    // Total active categories
    const totalCategories = await prisma.category.count({
      where: {
        isActive: true
      }
    });

    // Total orders
    const totalOrders = await prisma.order.count();

    // Orders by status
    const pendingOrders = await prisma.order.count({
      where: {
        status: "PENDING"
      }
    });

    const confirmedOrders = await prisma.order.count({
      where: {
        status: "CONFIRMED"
      }
    });

    const shippedOrders = await prisma.order.count({
      where: {
        status: "SHIPPED"
      }
    });

    const deliveredOrders = await prisma.order.count({
      where: {
        status: "DELIVERED"
      }
    });

    const cancelledOrders = await prisma.order.count({
      where: {
        status: "CANCELLED"
      }
    });

    // Total revenue
    const revenue = await prisma.order.aggregate({
      where: {
        status: {
          in: ["CONFIRMED", "SHIPPED", "DELIVERED"]
        }
      },
      _sum: {
        totalAmount: true
      }
    });

    // Low stock products
    const lowStockProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        stock: {
          lte: 5
        }
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true
      },
      orderBy: {
        stock: "asc"
      }
    });

    return res.status(200).json({
      message: "Dashboard data fetched successfully",

      users: {
        total: totalUsers
      },

      products: {
        total: totalProducts,
        lowStock: lowStockProducts.length,
        lowStockProducts
      },

      categories: {
        total: totalCategories
      },

      orders: {
        total: totalOrders,
        pending: pendingOrders,
        confirmed: confirmedOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
      },

      revenue: revenue._sum.totalAmount || 0
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch dashboard data"
    });
  }
};