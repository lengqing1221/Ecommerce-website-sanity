import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getMyOrders = async (userId : string) => {
    if(!userId) {
        throw new Error("User id is required");
    }

    // Define queries to get orders my userId sorted by orderDate desc
    

    const MY_ORDERS_QUERY = defineQuery(`
        *[
            _type == "order" && clerkUserId == $userId] | order(orderDate desc) {
                ...,
                products[] {
                    ...,
                    product->
                }
            }
        `)
        try {
            const orders = await sanityFetch({
                query: MY_ORDERS_QUERY,
                params: {
                    userId,
                }
            })
            return orders.data || []
        } catch (error) {
            console.error("Error fetching products:", error)
            throw new Error("Error fetching orders")
        }
};