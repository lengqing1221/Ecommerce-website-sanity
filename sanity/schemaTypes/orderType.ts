import { defineType } from 'sanity'
import { defineField } from 'sanity'
import { defineArrayMember } from 'sanity'
import { BasketIcon } from '@sanity/icons'

export const orderType = defineType({
    name: 'order',
    title: 'Order',
    type: 'document',
    icon: BasketIcon,
    fields: [
        defineField({
            name: 'orderNumber',
            title: 'Order Number',
            type: 'string',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'stripeCheckOutSessionId',
            title: 'Stripe Checkout Session ID',
            type: 'string',
        }),
        defineField({
            name: 'stripeCustomerId',
            title: 'Stripe Customer ID',
            type: 'string',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'clerkUserId',
            title: 'Store User ID',
            type: 'string',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'customerName',
            title: 'Customer Name',
            type: 'string',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'customerEmail',
            title: 'Customer Email',
            type: 'string',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'stripePaymentIntendId',
            title: "Stripe Payment Intent ID",
            type: 'string',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'products',
            title: 'Products',
            type: 'array',
            of: [
                defineArrayMember({
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'product',
                            title: 'Product Bought',
                            type: 'reference',
                            to: [{type: 'product'}],
                        }),
                        defineField({
                            name: 'quantity',
                            title: 'Quantity Purchaed',
                            type: 'number',
                        }),
                    ],
                    preview: {
                        select: {
                            product: 'product.name',
                            quantity: 'quantity',
                            image: 'product.image',
                            price: 'product.price',
                            currency: 'product.currency',
                        },
                        prepare(select) {
                                return {
                                    title: `${select.quantity} x ${select.product}`,
                                    media: select.image,
                                    subtitle: `${select.quantity} ${select.price}`,
                                };
                            },
                        },
                    }),
            ],
        }),
        defineField({
            name: 'total',
            title: 'Total',
            type: 'number',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'currency',
            title: 'Currency',
            type: 'string',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'amountDiscount',
            title: 'Amount Discount',
            type: 'number',
            validation: Rule => Rule.min(0),
        }),
        defineField({
            name: 'status',
            title: 'Order Status',
            type: 'string',
            options: {
                list: [
                    {title: "Pending", value: "pending"},
                    {title: "Paid", value: "paid"},
                    {title: 'Shipped', value: 'shipped'},
                    {title: "Delivered", value: "delivered"},
                    {title: "Cancelled", value: "cancelled"},
                ]
            }
        }),
    ],
    preview: {
        select: {
            name: 'customerName',
            amount: 'totalPrice',
            currency: 'currency',
            orderId: 'orderNumber',
            email: 'email',
        },
        prepare(select) {
            const orderIdSnipper = `${select.orderId.slice(0, 5)}...${select.orderId.slice(-5)}`
            return {
                title: `${select.name} (${orderIdSnipper})`,
                subtitle: `${select.currency} ${select.amount} ${select.email}`,
                media: BasketIcon
            }
        },
    },
})