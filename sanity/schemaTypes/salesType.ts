import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const salesType = defineType({
    name: 'sales',
    title: 'Sales',
    type: 'document',
    icon: TagIcon,
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            title: 'Sale Title'
        }),
        defineField({
            name: 'description',
            type: 'text',
            title: 'Sale Description'
        }),
        defineField({
            name: 'discountAmount',
            type: 'number',
            title: 'Discount Amount',
            description: 'Amount off in percentage or fixed value'
        }),
        defineField({
            name: 'couponCode',
            type: 'string',
            title: 'Coupon Code'
        }),
        defineField({
            name: 'validFrom',
            type: 'datetime', // Corrected type
            title: 'Valid From'
        }),
        defineField({
            name: 'validUntil',
            type: 'datetime', // Corrected type
            title: 'Valid Until'  
        }),
        defineField({
            name: 'isActive',
            type: 'boolean',
            title: 'Is Active',
            description: 'Toggle to active or inactive',
            initialValue: true
        })
    ],
    preview: {
        select: {
            title: 'title',
            discountAmount: 'discountAmount',
            couponCode: 'couponCode',   
            isActive: 'isActive',
        },
        prepare(select) {
            const { title, discountAmount, couponCode, isActive } = select
            const status = isActive ? 'Active' : 'Inactive'
            return {
                title, subtitle: `${discountAmount}% off - Code: ${couponCode} - ${status}`
            }
        }
    }
})
