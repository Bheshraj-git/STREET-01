import { PrismaClient, Role, DiscountType } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────
// Image helper — using Unsplash for realistic streetwear photos.
// Replace these with your own hosted images later.
// ─────────────────────────────────────────────────────────────
const img = (id: string) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

// A small pool of streetwear-ish images to reuse across products.
const IMAGE_POOL = [
    img("photo-1556821840-3a63f95609a7"), // hoodie
    img("photo-1620799140408-edc6dcb6d633"), // tee
    img("photo-1578681994506-b8f463449011"), // jacket
    img("photo-1473966968600-fa801b869a1a"), // pants
    img("photo-1542272604-787c3835535d"), // denim
    img("photo-1588850561407-ed78c282e89b"), // cap
    img("photo-1591047139829-d91aecb6caea"), // tee alt
    img("photo-1594633312681-425c7b97ccd1"), // hoodie alt
    img("photo-1544022613-e87ca75a784a"), // denim alt
    img("photo-1552374196-c4e7ffc6e126"), // bag
];

const COLORS = {
    black: { name: "Black", hex: "#0A0A0A" },
    cream: { name: "Cream", hex: "#EDE8DC" },
    grey: { name: "Grey", hex: "#6B6B66" },
    white: { name: "White", hex: "#FFFFFF" },
    olive: { name: "Olive", hex: "#5A5A3C" },
    navy: { name: "Navy", hex: "#1B2333" },
    rust: { name: "Rust", hex: "#B14B2A" },
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const ONE_SIZE = ["ONE SIZE"];

async function main() {
    console.log("🌱 Seeding STREET/01...");

    // ─── Cleanup (order matters due to FKs) ──────────────────
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.wishlistItem.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.review.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.address.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    // ─── Users ───────────────────────────────────────────────
    const passwordHash = await hash("ChangeMe123!", 10);

    const admin = await prisma.user.create({
        data: {
            name: "Admin",
            email: "admin@example.com",
            passwordHash,
            role: Role.ADMIN,
        },
    });

    const customer = await prisma.user.create({
        data: {
            name: "Aarav Shrestha",
            email: "customer@example.com",
            passwordHash,
            role: Role.CUSTOMER,
            phone: "+977 9800000000",
        },
    });

    // A few extra customers so the admin dashboard has data
    const extraCustomers = await Promise.all(
        [
            { name: "Priya Gurung", email: "priya@example.com" },
            { name: "Rohan Thapa", email: "rohan@example.com" },
            { name: "Sara Maharjan", email: "sara@example.com" },
            { name: "Dev Rai", email: "dev@example.com" },
        ].map((u) =>
            prisma.user.create({
                data: { ...u, passwordHash, role: Role.CUSTOMER },
            })
        )
    );

    // ─── Addresses ───────────────────────────────────────────
    await prisma.address.create({
        data: {
            userId: customer.id,
            label: "Home",
            fullName: "Aarav Shrestha",
            phone: "+977 9800000000",
            line1: "Jhamsikhel Road 12",
            city: "Lalitpur",
            state: "Bagmati",
            postalCode: "44700",
            country: "Nepal",
            isDefault: true,
        },
    });

    // ─── Categories ──────────────────────────────────────────
    const categoriesData = [
        { name: "T-Shirts", slug: "t-shirts", image: IMAGE_POOL[1] },
        { name: "Hoodies", slug: "hoodies", image: IMAGE_POOL[0] },
        { name: "Jackets", slug: "jackets", image: IMAGE_POOL[2] },
        { name: "Pants", slug: "pants", image: IMAGE_POOL[3] },
        { name: "Denim", slug: "denim", image: IMAGE_POOL[4] },
        { name: "Accessories", slug: "accessories", image: IMAGE_POOL[5] },
    ];

    const categories = await Promise.all(
        categoriesData.map((c, i) =>
            prisma.category.create({
                data: {
                    ...c,
                    description: `STREET/01 ${c.name.toLowerCase()} — built for everyday.`,
                    sortOrder: i,
                },
            })
        )
    );

    const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

    // ─── Products ────────────────────────────────────────────
    type SeedColor = keyof typeof COLORS;

    interface SeedProduct {
        name: string;
        slug: string;
        categorySlug: string;
        price: number;
        compareAtPrice?: number;
        description: string;
        materials: string;
        fit: string;
        colors: SeedColor[];
        sizes?: string[];
        featured?: boolean;
        isNewArrival?: boolean;
        lowStockVariant?: boolean;
        outOfStockVariant?: boolean;
        imageIdxs: number[];
    }

    const products: SeedProduct[] = [
        {
            name: "Oversized Essential Hoodie",
            slug: "oversized-essential-hoodie",
            categorySlug: "hoodies",
            price: 6500,
            compareAtPrice: 8200,
            description:
                "A heavyweight oversized hoodie cut from brushed cotton fleece. Dropped shoulders, ribbed cuffs, and a boxy silhouette. Garment-dyed for a lived-in feel from day one.",
            materials: "80% Cotton, 20% Polyester. 420 GSM.",
            fit: "Oversized. Size down for a regular fit.",
            colors: ["black", "cream", "grey"],
            featured: true,
            isNewArrival: true,
            lowStockVariant: true,
            outOfStockVariant: true,
            imageIdxs: [0, 7, 1],
        },
        {
            name: "Heavyweight Box Logo Tee",
            slug: "heavyweight-box-logo-tee",
            categorySlug: "t-shirts",
            price: 2800,
            description:
                "A 240 GSM boxy tee with a screen-printed logo. Heavier than standard cotton, softer after every wash.",
            materials: "100% Organic Cotton. 240 GSM.",
            fit: "Boxy fit. True to size.",
            colors: ["black", "white", "cream"],
            featured: true,
            isNewArrival: true,
            imageIdxs: [1, 6, 7],
        },
        {
            name: "Utility Cargo Pants",
            slug: "utility-cargo-pants",
            categorySlug: "pants",
            price: 7200,
            compareAtPrice: 8900,
            description:
                "Six-pocket cargo pants in a durable cotton twill. Adjustable hem, gusseted crotch, and reinforced knees.",
            materials: "100% Cotton Twill. 320 GSM.",
            fit: "Relaxed. Straight leg.",
            colors: ["black", "olive"],
            featured: true,
            lowStockVariant: true,
            imageIdxs: [3, 4, 2],
        },
        {
            name: "Washed Graphic Tee",
            slug: "washed-graphic-tee",
            categorySlug: "t-shirts",
            price: 2400,
            description:
                "Garment-washed tee with a faded back print. Each piece is unique due to the wash process.",
            materials: "100% Cotton. 220 GSM.",
            fit: "Regular. True to size.",
            colors: ["grey", "rust"],
            isNewArrival: true,
            imageIdxs: [6, 1, 7],
        },
        {
            name: "Relaxed Denim Jacket",
            slug: "relaxed-denim-jacket",
            categorySlug: "denim",
            price: 9800,
            description:
                "A relaxed-fit trucker jacket in 13oz rigid denim. Copper hardware, chain-stitched hem.",
            materials: "100% Cotton Denim. 13oz.",
            fit: "Relaxed. True to size.",
            colors: ["navy", "black"],
            featured: true,
            imageIdxs: [4, 8, 2],
        },
        {
            name: "Techwear Crossbody Bag",
            slug: "techwear-crossbody-bag",
            categorySlug: "accessories",
            price: 3900,
            description:
                "Water-resistant crossbody with magnetic buckles and a hidden rear pocket. Fits a 10-inch tablet.",
            materials: "Cordura nylon, YKK hardware.",
            fit: "Adjustable strap.",
            colors: ["black", "olive"],
            sizes: ONE_SIZE,
            isNewArrival: true,
            lowStockVariant: true,
            imageIdxs: [9, 5],
        },
        {
            name: "Classic Street Cap",
            slug: "classic-street-cap",
            categorySlug: "accessories",
            price: 1800,
            compareAtPrice: 2400,
            description:
                "Six-panel cap with an embroidered logo. Adjustable strap with a metal buckle.",
            materials: "100% Cotton Canvas.",
            fit: "One size. Adjustable.",
            colors: ["black", "cream", "navy"],
            sizes: ONE_SIZE,
            imageIdxs: [5, 9],
        },
        {
            name: "Oversized Varsity Jacket",
            slug: "oversized-varsity-jacket",
            categorySlug: "jackets",
            price: 12500,
            description:
                "Wool-blend body with contrast leather sleeves. Ribbed cuffs and hem, chenille patch on the chest.",
            materials: "Wool blend body, PU leather sleeves.",
            fit: "Oversized. Size down for regular.",
            colors: ["navy", "black"],
            featured: true,
            outOfStockVariant: true,
            imageIdxs: [2, 4],
        },
        {
            name: "Wide Leg Cargo",
            slug: "wide-leg-cargo",
            categorySlug: "pants",
            price: 6900,
            description:
                "Wide-leg cargo with adjustable ankle toggles. Deep pockets, roomy throughout.",
            materials: "Cotton-nylon blend.",
            fit: "Wide. True to size.",
            colors: ["black", "olive", "grey"],
            isNewArrival: true,
            imageIdxs: [3, 4],
        },
        {
            name: "Minimal Logo Sweatshirt",
            slug: "minimal-logo-sweatshirt",
            categorySlug: "hoodies",
            price: 4900,
            description:
                "Crewneck sweatshirt with a tonal chest logo. Loopback cotton, mid-weight.",
            materials: "100% Cotton. 380 GSM.",
            fit: "Regular. True to size.",
            colors: ["cream", "black", "grey"],
            imageIdxs: [7, 0],
        },
        {
            name: "Distressed Denim Shorts",
            slug: "distressed-denim-shorts",
            categorySlug: "denim",
            price: 4400,
            description:
                "Knee-length denim shorts with hand-distressed detailing. Rigid 12oz denim.",
            materials: "100% Cotton Denim. 12oz.",
            fit: "Regular. True to size.",
            colors: ["navy"],
            imageIdxs: [4, 8],
        },
        {
            name: "Reflective Shell Jacket",
            slug: "reflective-shell-jacket",
            categorySlug: "jackets",
            price: 14800,
            compareAtPrice: 17900,
            description:
                "Fully seam-sealed shell with 3M reflective panels. Taped zips and a storm hood.",
            materials: "Recycled polyester, 3M reflective.",
            fit: "Regular. Room for layering.",
            colors: ["black", "grey"],
            featured: true,
            lowStockVariant: true,
            imageIdxs: [2, 0],
        },
        {
            name: "Ribbed Beanie",
            slug: "ribbed-beanie",
            categorySlug: "accessories",
            price: 1400,
            description: "Fine-ribbed beanie in merino wool blend. Folded cuff with a woven tag.",
            materials: "Merino wool blend.",
            fit: "One size.",
            colors: ["black", "cream", "rust"],
            sizes: ONE_SIZE,
            imageIdxs: [5],
        },
        {
            name: "Heavy Fleece Shorts",
            slug: "heavy-fleece-shorts",
            categorySlug: "pants",
            price: 3200,
            description: "Fleece-backed cotton shorts with drawcord waist and side pockets.",
            materials: "80% Cotton, 20% Polyester. 380 GSM.",
            fit: "Regular.",
            colors: ["grey", "black"],
            imageIdxs: [3],
        },
        {
            name: "Boxy Pocket Tee",
            slug: "boxy-pocket-tee",
            categorySlug: "t-shirts",
            price: 2600,
            description: "Boxy tee with a single chest pocket and tonal stitching.",
            materials: "100% Cotton. 240 GSM.",
            fit: "Boxy.",
            colors: ["white", "black", "olive"],
            imageIdxs: [1, 6],
        },
        {
            name: "Quilted Liner Jacket",
            slug: "quilted-liner-jacket",
            categorySlug: "jackets",
            price: 8900,
            description:
                "Diamond-quilted liner jacket. Wear alone or under a shell. Snap-button front.",
            materials: "Recycled poly shell, poly fill.",
            fit: "Regular.",
            colors: ["olive", "black"],
            isNewArrival: true,
            imageIdxs: [2, 8],
        },
        {
            name: "Utility Belt Bag",
            slug: "utility-belt-bag",
            categorySlug: "accessories",
            price: 2900,
            description: "Compact belt bag with quick-release buckle. Wear crossbody or at the hip.",
            materials: "Ripstop nylon.",
            fit: "One size.",
            colors: ["black", "rust"],
            sizes: ONE_SIZE,
            imageIdxs: [9],
        },
        {
            name: "Washed Black Denim",
            slug: "washed-black-denim",
            categorySlug: "denim",
            price: 8400,
            description:
                "Straight-leg black denim with a vintage wash. Slight taper below the knee.",
            materials: "100% Cotton Denim. 13oz.",
            fit: "Straight. True to size.",
            colors: ["black"],
            imageIdxs: [4, 8],
        },
        {
            name: "Cropped Zip Hoodie",
            slug: "cropped-zip-hoodie",
            categorySlug: "hoodies",
            price: 5800,
            compareAtPrice: 6900,
            description:
                "Cropped full-zip hoodie in heavyweight fleece. Raw-edge hem.",
            materials: "80% Cotton, 20% Polyester. 420 GSM.",
            fit: "Cropped. True to size.",
            colors: ["cream", "grey"],
            isNewArrival: true,
            imageIdxs: [0, 7],
        },
        {
            name: "Nylon Track Pants",
            slug: "nylon-track-pants",
            categorySlug: "pants",
            price: 5600,
            description:
                "Lightweight nylon track pants with side snaps. Packs down small, dries fast.",
            materials: "Recycled nylon.",
            fit: "Regular.",
            colors: ["black", "navy"],
            imageIdxs: [3, 2],
        },
        {
            name: "Embroidered Logo Hoodie",
            slug: "embroidered-logo-hoodie",
            categorySlug: "hoodies",
            price: 6200,
            description: "Pullover hoodie with an embroidered chest logo. Kangaroo pocket.",
            materials: "100% Cotton. 400 GSM.",
            fit: "Regular.",
            colors: ["olive", "black"],
            imageIdxs: [0, 7],
        },
    ];

    const createdProducts: { id: string; name: string; slug: string; price: number }[] = [];

    for (const p of products) {
        const cat = catBySlug[p.categorySlug];
        const sizes = p.sizes ?? SIZES;

        const created = await prisma.product.create({
            data: {
                name: p.name,
                slug: p.slug,
                description: p.description,
                materials: p.materials,
                fit: p.fit,
                categoryId: cat.id,
                price: p.price,
                compareAtPrice: p.compareAtPrice ?? null,
                sku: `SW-${p.slug.toUpperCase()}`,
                featured: p.featured ?? false,
                isNewArrival: p.isNewArrival ?? false,
                published: true,
                images: {
                    create: p.imageIdxs.map((idx, i) => ({
                        url: IMAGE_POOL[idx],
                        alt: `${p.name} — view ${i + 1}`,
                        sortOrder: i,
                    })),
                },
                variants: {
                    create: p.colors.flatMap((colorKey) => {
                        const color = COLORS[colorKey];
                        return sizes.map((size) => {
                            let stock = 8 + Math.floor(Math.random() * 20);
                            if (p.lowStockVariant && size === "M" && colorKey === p.colors[0]) {
                                stock = 2;
                            }
                            if (p.outOfStockVariant && size === "XL" && colorKey === p.colors[0]) {
                                stock = 0;
                            }
                            return {
                                color: color.name,
                                colorHex: color.hex,
                                size,
                                sku: `${p.slug.toUpperCase()}-${colorKey.toUpperCase()}-${size}`,
                                stock,
                            };
                        });
                    }),
                },
            },
        });

        createdProducts.push({
            id: created.id,
            name: created.name,
            slug: created.slug,
            price: Number(created.price),
        });
    }

    console.log(`✅ Created ${createdProducts.length} products`);

    // ─── Reviews ─────────────────────────────────────────────
    const reviewTemplates = [
        { rating: 5, title: "Exactly as pictured", body: "Fabric is thick and the fit is spot on. Will buy again." },
        { rating: 4, title: "Great quality", body: "Slightly larger than expected but I like the oversized look." },
        { rating: 5, title: "New favorite", body: "Wore it three days straight. Washes well too." },
        { rating: 3, title: "Decent", body: "Good piece but the color is a bit different from the photos." },
        { rating: 5, title: "Worth every rupee", body: "Premium feel, solid construction. No complaints." },
        { rating: 4, title: "Solid", body: "Runs slightly small, size up if you're in between." },
    ];

    const reviewers = [customer, ...extraCustomers];

    for (const product of createdProducts) {
        // Each product gets 2-4 reviews from random reviewers
        const count = 2 + Math.floor(Math.random() * 3);
        const shuffled = [...reviewers].sort(() => Math.random() - 0.5).slice(0, count);
        for (const reviewer of shuffled) {
            const t = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
            await prisma.review.create({
                data: {
                    productId: product.id,
                    userId: reviewer.id,
                    rating: t.rating,
                    title: t.title,
                    body: t.body,
                    approved: true,
                },
            });
        }
    }

    console.log("✅ Created reviews");

    // ─── Coupons ─────────────────────────────────────────────
    await prisma.coupon.createMany({
        data: [
            {
                code: "STREET10",
                description: "10% off your order",
                discountType: DiscountType.PERCENTAGE,
                discountValue: 10,
                minOrderAmount: 2000,
                maxUses: 500,
                active: true,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90), // 90 days
            },
            {
                code: "WELCOME500",
                description: "Rs. 500 off first order",
                discountType: DiscountType.FIXED,
                discountValue: 500,
                minOrderAmount: 3000,
                maxUses: 1000,
                active: true,
            },
            {
                code: "SUMMER20",
                description: "20% off — expired",
                discountType: DiscountType.PERCENTAGE,
                discountValue: 20,
                active: false,
                expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // yesterday
            },
        ],
    });

    console.log("✅ Created coupons");

    // ─── Sample orders (so admin dashboard has data) ─────────
    const orderCustomers = [customer, ...extraCustomers];
    const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

    let orderCounter = 1;
    for (let i = 0; i < 12; i++) {
        const user = orderCustomers[i % orderCustomers.length];
        const numItems = 1 + Math.floor(Math.random() * 3);
        const productPicks = [...createdProducts]
            .sort(() => Math.random() - 0.5)
            .slice(0, numItems);

        const itemsData = await Promise.all(
            productPicks.map(async (p) => {
                const variant = await prisma.productVariant.findFirst({
                    where: { productId: p.id },
                });
                if (!variant) return null;
                const qty = 1 + Math.floor(Math.random() * 2);
                const unitPrice = p.price;
                return {
                    productId: p.id,
                    variantId: variant.id,
                    productName: p.name,
                    color: variant.color,
                    size: variant.size,
                    quantity: qty,
                    unitPrice,
                    total: unitPrice * qty,
                };
            })
        ).then((r) => r.filter((x): x is NonNullable<typeof x> => x !== null));

        if (itemsData.length === 0) continue;

        const subtotal = itemsData.reduce((s, i) => s + i.total, 0);
        const shippingCost = subtotal > 5000 ? 0 : 200;
        const total = subtotal + shippingCost;
        const status = ORDER_STATUSES[i % ORDER_STATUSES.length];
        const paymentStatus = status === "PENDING" ? "PENDING" : "PAID";

        await prisma.order.create({
            data: {
                orderNumber: `SW-2026-${String(1000 + orderCounter).padStart(6, "0")}`,
                userId: user.id,
                email: user.email,
                customerName: user.name ?? "Guest",
                shippingAddress: {
                    fullName: user.name ?? "Guest",
                    line1: "Kathmandu",
                    city: "Kathmandu",
                    state: "Bagmati",
                    postalCode: "44600",
                    country: "Nepal",
                },
                subtotal,
                shippingCost,
                total,
                paymentStatus,
                orderStatus: status,
                items: { create: itemsData },
            },
        });
        orderCounter++;
    }

    console.log("✅ Created sample orders");
    console.log(`\n🎉 Seed complete.`);
    console.log(`   Admin login:    admin@example.com / ChangeMe123!`);
    console.log(`   Customer login: customer@example.com / ChangeMe123!\n`);
    console.log(`   ⚠️  DEMO CREDENTIALS — do NOT use in production.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });