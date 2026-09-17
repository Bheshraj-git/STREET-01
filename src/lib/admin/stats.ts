import "server-only";
import { prisma } from "@/lib/prisma";

export interface DashboardStats {
    revenue: number;
    orderCount: number;
    customerCount: number;
    productCount: number;
    revenueSeries: { date: string; revenue: number; orders: number }[];
    recentOrders: {
        id: string;
        orderNumber: string;
        customerName: string;
        total: number;
        orderStatus: string;
        createdAt: string;
    }[];
    lowStock: {
        id: string;
        productName: string;
        color: string;
        size: string;
        stock: number;
    }[];
    recentCustomers: {
        id: string;
        name: string | null;
        email: string;
        createdAt: string;
    }[];
    totalStock: number;
    totalStockValue: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const [
        revenueAgg,
        orderCount,
        customerCount,
        productCount,
        recentOrders,
        lowStock,
        recentCustomers,
        stockAgg,
        revenueSeriesRaw,
    ] = await Promise.all([
        prisma.order.aggregate({
            where: { orderStatus: { not: "CANCELLED" } },
            _sum: { total: true },
        }),
        prisma.order.count({ where: { orderStatus: { not: "CANCELLED" } } }),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.product.count(),
        prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                orderNumber: true,
                customerName: true,
                total: true,
                orderStatus: true,
                createdAt: true,
            },
        }),
        prisma.productVariant.findMany({
            where: { stock: { lte: 4 } },
            orderBy: { stock: "asc" },
            take: 8,
            include: {
                product: { select: { name: true } },
            },
        }),
        prisma.user.findMany({
            where: { role: "CUSTOMER" },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: { id: true, name: true, email: true, createdAt: true },
        }),
        prisma.productVariant.aggregate({
            _sum: { stock: true },
        }),
        prisma.$queryRaw<
            { day: Date; revenue: string; orders: bigint }[]
        >`
      SELECT
        DATE_TRUNC('day', "createdAt") AS day,
        SUM(total)::text AS revenue,
        COUNT(*) AS orders
      FROM "Order"
      WHERE "createdAt" >= NOW() - INTERVAL '30 days'
        AND "orderStatus" != 'CANCELLED'
      GROUP BY day
      ORDER BY day ASC
    `,
    ]);

    // Fill in missing days so the chart has continuous data
    const seriesMap = new Map<
        string,
        { date: string; revenue: number; orders: number }
    >();
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setUTCHours(0, 0, 0, 0);
        d.setUTCDate(d.getUTCDate() - i);
        const key = d.toISOString().slice(0, 10);
        seriesMap.set(key, { date: key, revenue: 0, orders: 0 });
    }
    for (const row of revenueSeriesRaw) {
        const key = new Date(row.day).toISOString().slice(0, 10);
        const existing = seriesMap.get(key);
        if (existing) {
            existing.revenue = Number(row.revenue);
            existing.orders = Number(row.orders);
        }
    }

    return {
        revenue: Number(revenueAgg._sum.total ?? 0),
        orderCount,
        customerCount,
        productCount,
        revenueSeries: Array.from(seriesMap.values()),
        recentOrders: recentOrders.map((o) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            customerName: o.customerName,
            total: Number(o.total),
            orderStatus: o.orderStatus,
            createdAt: o.createdAt.toISOString(),
        })),
        lowStock: lowStock.map((v) => ({
            id: v.id,
            productName: v.product.name,
            color: v.color,
            size: v.size,
            stock: v.stock,
        })),
        recentCustomers: recentCustomers.map((c) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            createdAt: c.createdAt.toISOString(),
        })),
        totalStock: Number(stockAgg._sum.stock ?? 0),
        totalStockValue: 0,
    };
}