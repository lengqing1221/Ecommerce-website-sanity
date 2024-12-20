import { getProductBySlug } from '@/sanity/lib/products/getProductBySlug';
import { notFound } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import { imageUrl } from '@/lib/imageUrl';
import { PortableText } from '@portabletext/react';
import AddToBasketButton from '@/components/AddToBasketButton';

const ProductPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) return notFound();

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2">
                    <Image
                        src={imageUrl(product.image!).url()}
                        alt={product.name!}
                        width={600}
                        height={600}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="lg:w-1/2">
                    <h1 className="text-3xl font-semibold">{product.name}</h1>
                    <p className="text-xl text-gray-600 mt-2">{product.price}</p>
                    <PortableText value={product.description!} />
                    <div className="mt-4">
                        <AddToBasketButton product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
