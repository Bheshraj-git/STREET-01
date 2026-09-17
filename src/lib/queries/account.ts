import "server-only";
import { prisma } from "@/lib/prisma";

export interface OrderSummary {
    id: string;
    orderNumber: string;
    createdAt: string;
    total: number;
    orderStatus: string;
    paymentStatus: string;
    itemCount: number;
    firstImage: string | null;
    firstItemName: string;
}

export async function getUserOrders(userId: string): Promise<OrderSummary[]> {
    const rows = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                select: {
                    productName: true,
                    image: true,
                },
                take: 1,
            },
            _count: { select: { items: true } },
        },
    });

    return rows.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        createdAt: o.createdAt.toISOString(),
        total: Number(o.total),
        orderStatus: o.orderStatus,
        paymentStatus: o.paymentStatus,
        itemCount: o._count.items,
        firstImage: o.items[0]?.image ?? null,
        firstItemName: o.items[0]?.productName ?? "",
    }));
}

export async function getUserOrder(userId: string, orderNumber: string) {
    const order = await prisma.order.findFirst({
        where: { userId, orderNumber },
        include: { items: { orderBy: { id: "asc" } } },
    });
    if (!order) return null;

    return {
        id: order.id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt.toISOString(),
        email: order.email,
        phone: order.phone,
        customerName: order.customerName,
        shippingAddress: order.shippingAddress as Record<string, string | null>,
        subtotal: Number(order.subtotal),
        discount: Number(order.discount),
        shippingCost: Number(order.shippingCost),
        tax: Number(order.tax),
        total: Number(order.total),
        couponCode: order.couponCode,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        items: order.items.map((i) => ({
            id: i.id,
            productName: i.productName,
            color: i.color,
            size: i.size,
            image: i.image,
            quantity: i.quantity,
            unitPrice: Number(i.unitPrice),
            total: Number(i.total),
        })),
    };
}

export async function getUserAddresses(userId: string) {
    return prisma.address.findMany({
        where: { userId },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
}

export async function getUserWishlist(userId: string) {
    const rows = await prisma.wishlistItem.findMany({
        where: { wishlist: { userId } },
        orderBy: { createdAt: "desc" },
        include: {
            product: {
                include: {
                    images: { orderBy: { sortOrder: "asc" }, take: 1 },
                    category: { select: { name: true, slug: true } },
                },
            },
        },
    });

    return rows.map((r) => ({
        id: r.id,
        productId: r.product.id,
        slug: r.product.slug,
        name: r.product.name,
        image: r.product.images[0]?.url ?? "",
        price: Number(r.product.price),
        compareAtPrice: r.product.compareAtPrice
            ? Number(r.product.compareAtPrice)
            : null,
        categoryName: r.product.category.name,
    }));
}