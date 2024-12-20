'use client'
import { ClerkLoaded, SignInButton, UserButton, useUser, SignedIn } from '@clerk/nextjs';
import Link from 'next/link';
import Form from 'next/form'
import React from 'react'
import { TrolleyIcon } from "@sanity/icons";
import { PackageIcon } from "lucide-react";
import useBasketStore from '@/app/(store)/store';

const Header = () => {
    const { user } = useUser();
    const itemCount = useBasketStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));

    const createClerkPasskey = async () => {
        try {
            const response = await user?.createPasskey()
            console.log(response)
        } catch (err) {
            console.error("Error:", JSON.stringify(err, null, 2))
        }
    }

  return (
    <header className='flex flex-col flex-wrap items-center justify-between py-2 px-4'>
        <div className='flex w-full flex-wrap justify-between items-center'>
            <Link href="/" className='text-2xl font-bold text-blue-500 hover:opacity:50 cursor-pointer mx-auto sm:mx-0'>Shopr</Link>
            <Form
            action='/search'
            className='w-full sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0'
            >
                <input type="text"
                name='query' 
                placeholder='Search for products'
                className='bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-blue-500 w-full border max-w-4xl'
                />
            </Form>
            <div 
            className='flex items-center space-x-4 mt-4 sm:mt-0 flex-1 sm:flex-none'>
                <Link href='/basket' className='flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                <TrolleyIcon className='w-6 h-6'/>
                    {/* span item count once gloall state is implemented */}
                    <span className='absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center z-10'>
    {itemCount}
  </span>
  <span>My Basket</span>
                </Link>
                {/* User area */}
                <ClerkLoaded>
                    <SignedIn>
                        <Link href='/orders' className='flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                            <PackageIcon className='w-6 h-6'/>
                            <span>My Orders</span>
                        </Link>
                    </SignedIn>
                    { user ? (
                        <div className='flex items-center space-x-2'>
                            <UserButton />
                            <div className='hidden sm:block text-xs'>
                                <p className='text-gray-400'></p>
                                <p className='font-bold'></p>
                            </div>
                        </div>
                    ) : (
                        <SignInButton>Sign In</SignInButton>
                    )}  
                    {user?.passkeys.length === 0 && (
                        <button
                        onClick={createClerkPasskey}
                        className='hover:bg-blue-700 bg-white border text-blue-500 rounded hover:text-white font-bold py-2 px-4'
                        >
                            Create passkey
                        </button>
                    )}
                </ClerkLoaded>
            </div>
        </div>
    </header>
  )
}

export default Header
