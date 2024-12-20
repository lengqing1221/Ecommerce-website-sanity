import ProductsView from "@/components/ProductsView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getProductsByCategory } from "@/sanity/lib/products/getProductsByCategory";

async function CategoryPage(
    { params }: { params: { slug: string } }
) {
    const { slug } = params ?? {};

    if (!slug) {
        // Return an error or fallback UI if no slug is present
        return <div>Error: Category not found.</div>;
    }

    try {
        const products = await getProductsByCategory(slug);
        const categories = await getAllCategories();

        return (
            <div className='flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4'>
                <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-4xl'>
                    <h1 className='text-3xl font-bold mb-6 text-center'>
                        {slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}{" "}
                        Collection
                    </h1>
                    {/* Handle products and categories data */}
                    <ProductsView products={products} categories={categories} />
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error fetching data:", error);
        return <div>Error: Failed to load products or categories.</div>;
    }
}

export default CategoryPage;
