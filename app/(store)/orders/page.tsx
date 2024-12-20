import React from 'react'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getMyOrders } from '@/lib/orders/getMyOrders';
import { formatCurrency } from '@/lib/formatCurrency';
import Image from 'next/image';
import { imageUrl } from '@/lib/imageUrl';

interface Order {
    orderNumber: string;
    orderDate: string | null;
    status: string;
    currency: string;
    totalPrice: number;
    amountDiscount?: number;
    products: {
        product: {
            _id: string;
            name: string;
            price: number;
            image: string;
        };
        quantity: number;
    }[];
}

async function OrdersPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/');
    }

    // Type the orders array properly as Order[]
    const orders: Order[] = await getMyOrders(userId);

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4'>
            <div className='bg-white p-4 sm:p-8 rounded-xl shadow-lg w-full max-w-4xl'>
                <h1 className='text-4xl font-bold text-gray-800 tracking-tight mb-8'>
                    My Orders
                </h1>
                {orders.length === 0 ? (
                    <div className='text-center text-gray-600'>
                        <p>You have not placed any orders yet.</p>
                    </div>
                ) : (
                    <div className='space-y-6 sm:space-y-8'>
                        {orders.map((order) => (
                            <div key={order.orderNumber} className='p-4 border-b sm:p-6 border-gray-200'>
                                <div className='flex flex-col gap-4 sm:flex-row sm: justify-between sm:items-center mb-4'>
                                    <div>
                                        <p className='text-sm text-gray-600 mb-1 font-bold'>
                                            Order Number
                                        </p>
                                        <p className='font-momo text:sm text-green-600 break-all'>
                                            {order.orderNumber}
                                        </p>
                                    </div>
                                    <div className='sm:text-right'>
                                        <p className='text-sm text-gray-600 mb-1'>
                                            Order Date
                                        </p>
                                        <p className='font-medium'>
                                            {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
                                        </p>
                                    </div>
                                    <div className='flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center'>
                                        <div className='flex items-center'>
                                            <span className='text-sm mr-2'>Status: </span>
                                            <span className={`px-3 py-1 rounded-full text-sm ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className='sm:text-right'>
                                            <p className='text-sm text-gray-600 mb-1'>Total Amount</p>
                                            <p className='font-bold text-lg'>
                                                {formatCurrency(order.totalPrice ?? 0, order.currency)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {order.amountDiscount ? (
                                    <div className="mt-4 p-3 sm:p-4 bg-red-50 rounded-lg">
                                        <p className='text-red-600 font-medium mb-1 text-sm sm:text-base'>
                                            Discount Applied:{" "}
                                            {formatCurrency(order.amountDiscount, order.currency)}
                                        </p>
                                        <p>
                                            Original Subtotal:{" "}
                                            {formatCurrency((order.totalPrice ?? 0) + (order.amountDiscount ?? 0), order.currency)}
                                        </p>
                                    </div>
                                ) : null}

                                {/* Product details */}
                                <div className='px-4 py-3 sm:px-6 sm:py-4'>
                                    <p className='text-sm font-semibold text-gray-600 mb-3 sm:mb-4'>
                                        Order Items
                                    </p>
                                    <div className='space-y-3 sm:space-y-4'>
                                        {order.products.map((product) => (
                                            <div key={product.product._id} className='flex items-center gap-4'>
                                                <div className='relative h-14 w-14 sm:h-16 sm:w-16 flex flex-shrink-0 rounded-md overflow-hidden'>
                                                    <Image
                                                        src={imageUrl(product.product.image).url()}
                                                        alt={product.product?.name ?? ''}
                                                        className='object-cover object-center'
                                                        fill
                                                    />
                                                </div>
                                                <div>
                                                    <p className='font-medium text-sm sm:text-base'>
                                                        {product.product.name}
                                                    </p>
                                                    <p className='text-sm sm:text-base font-medium'>
                                                        Quantity: {product.quantity ?? "N/A"}
                                                    </p>
                                                </div>
                                                <p className='font-medium text-right'>
                                                    {product.product.price && product.quantity
                                                        ? formatCurrency(product.product.price * product.quantity, order.currency)
                                                        : "N/A"}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrdersPage;
