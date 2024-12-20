'use client'

import useBasketStore from '@/app/(store)/store';
import { SignInButton, useAuth, useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddToBasketButton from '@/components/AddToBasketButton';
import Image from 'next/image';
import { imageUrl } from '@/lib/imageUrl';
import Loader from '@/components/Loader';
import { createCheckOutSession, Metadata } from '@/actions/createCheckOutSession';

function BasketPage() {
    const groupedItems = useBasketStore((state) => state.getGroupedItems());
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const router = useRouter();

    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // waiting for client componenent to mount
    useEffect(() => {
        setIsClient(true);
    }, []);

    if(!isClient) {
        return <Loader />;
    }
    
    const handleCheckOut = async () => {
      if(!isSignedIn) return;
      setIsLoading(true)
      try {
        const metadata: Metadata = {
            orderNumber: crypto.randomUUID(),
            customerName: user?.fullName ?? "Unknown",
            customerEmail: user?.emailAddresses[0].emailAddress ?? "Unknown",
            clerkUserId: user!.id
        }
        const checkoutUrl = await createCheckOutSession(groupedItems, metadata);
        

        if (checkoutUrl) {
            window.location.href = checkoutUrl
            console.log(checkoutUrl)
        }
      } catch (error) {
        console.error("Error creating checkout session:", error)
      } finally {
        setIsLoading(false)
      }
    };


    if (groupedItems.length === 0) {
        return (
            <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Your basket</h1>
                <p className='text-gray-600 text-lg'>
                    Your Basket is empty
                </p>
            </div>
        );
    }

    return (
        <div className='container mx-auto p-4'>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Your
                Basket
                </h1>
                <div className='flex flex-col lg:flex-row gap-8'>
                    <div
                        className='flex-grow'>
                            {groupedItems?.map((item) => (
                                <div key={item.product._id} className='mb-4 p-4 border rounded flex items-center justify-between'>
                                    <div className='flex items-center cursor-pointer flex-1 min-w-0' onClick={() => router.push(`/product/${item.product.slug?.current}`)}>
                                        <div className='w-20 h-20 sm:w-24 sm:h-24 mr-4 bg-gray-200 rounded flex-shrink-0'>
                                        {item.product.image && (
                                            <Image src={imageUrl(item.product.image).url()} alt={item.product.name ?? "Product image"} width={100} height={100} className='object-cover w-full h-full' />
                                        )}
                                        </div>
                                        <div className='min-w-0'>
                                            <h2 className="text-lg s:text:xl font-semibold truncate">{item.product.name}</h2>
                                            <p className='text-sm sm:text-base'>
                                            Price: $   
                                            {((item.product.price ?? 0) * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center ml-4 flex-shrink-0">
                                        <AddToBasketButton product={item.product} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='w-full lg:w-80 lg:sticky lg:top-4 bg-white h-fit p-6 border rounded order-first lg:order-last fixed bottom-0 left-0 lg:left-auto'>
                            <h3 className='text-xl font-semibold'>
                                Order Summary
                            </h3>
                            <div className='mt-4 space-y-2'>
                                <p className="flex justify-between">
                                    <span>Items:</span>
                                    <span>${groupedItems.reduce((total, item) => total + (item.product.price ?? 0) * item.quantity, 0).toFixed(2)}</span>
                                </p>
                                <p className="flex justify-between text-2xl font-bold borderr-t pt-2">
                                    <span>Total:</span>
                                    <span>${useBasketStore.getState().getTotal().toFixed(2)}</span>
                                </p>
                            </div>
                            {isSignedIn ? (
                                <button onClick={handleCheckOut}
                                disabled={isLoading}
                                className='w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400'>
                                    {isLoading ? "Processing..." : "Checkout"}
                                </button>
                            ) : (
                                <SignInButton mode="modal">
                                    <button className='mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
                                        Sign in to checkout
                                    </button>
                                </SignInButton>
                            )}
                        </div>
                        <div className='h-64 lg:h-0'>
                            {/* spacer for fixed checkout on mobile */}
                        </div>
                </div>
        </div>
    );
}

export default BasketPage;
