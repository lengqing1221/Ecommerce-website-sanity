import { Product, Category } from "@/sanity.types";
import ProductGrid from "./ProductGrid";
import { CategorySelector } from "@/components/ui/category-selector";

interface ProductsViewProps {
    products: Product[];
    categories: Category[]; // Fixed typo here
}

const ProductsView = ({ products, categories }: ProductsViewProps) => {
    return(
        <div>
            {/* categories */}
            <div className="flex flex-col">
            <CategorySelector categories={categories} />
            </div>
            Products View
            {/* products */}
            <div>
                <div className="flex-1">
                <ProductGrid products={products} />
                <hr className="w-1/2 sm:w-3/4"/>
                </div>
            </div>
        </div>
    );
}

export default ProductsView;
