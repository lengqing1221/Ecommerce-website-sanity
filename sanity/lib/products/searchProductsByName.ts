import { defineQuery } from 'next-sanity'
import { sanityFetch } from '../live'

export const searchProductsByName = async (searchParams: string) => {
    // Define query with parameter
    const PRODUCT_SEARCH_QUERY = defineQuery(`
        *[
            _type == "product" && name match $searchParams
        ] | order(name asc)
    `)

    try {
        // Pass the searchParams variable to the query
        const products = await sanityFetch({
            query: PRODUCT_SEARCH_QUERY,
            params: {
                searchParams: `${searchParams}*`,  // Add wildcard (*) for partial matches
            }
        })

        // Return fetched products, or an empty array if no products found
        return products.data || []
    } catch (error) {
        console.error('Error fetching products:', error)
        return []
    }
}
