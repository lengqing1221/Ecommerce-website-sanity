'use server'

import stripe from '../lib/stripe';
import { imageUrl } from '../lib/imageUrl';
import { BasketItem } from '@/app/(store)/store';

export type Metadata = {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    clerkUserId: string;
}

export type GroupedBasketItem = {
    product: BasketItem["product"];
    quantity: number;
}

export async function createCheckOutSession(
    items: GroupedBasketItem[],
    metadata: Metadata
) {
    try {
        const itemsWithoutPrice = items.filter((item) => item.product.price == null);
        if (itemsWithoutPrice.length > 0) {
            throw new Error("Some items do not have a price");
        }
        
        const customer = await stripe.customers.list({
            email: metadata.customerEmail,
            limit: 1
        });

        let customerId: string | undefined;
        if (customer.data.length > 0) {
            customerId = customer.data[0].id;
        }

        const successUrl = `${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_BASE_URL}/success?orderNumber=${metadata.orderNumber}`;
        const cancelUrl = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_BASE_URL;

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            customer_creation: customerId ? undefined : "always",
            customer_email: !customerId ? metadata.customerEmail : undefined,
            metadata,
            mode: 'payment',
            allow_promotion_codes: true,
            success_url: successUrl,
            cancel_url: cancelUrl,
            line_items: items.map((item) => ({
                    price_data: {
                        currency: 'usd',
                        unit_amount: Math.round(item.product.price! * 100),
                        product_data: {
                            name: item.product.name || "Unnamed Product",
                            description: `Product ID: ${item.product._id}`,
                            metadata: {
                                id: item.product._id
                            },
                            images: item.product.image ? [imageUrl(item.product.image).url()] : undefined,
                        },
                    },
                    quantity: item.quantity
            }))
        });

        return session.url;
    } catch (error) {
        console.error("Error creating checkout session:", error);
        throw error;
    }
}
