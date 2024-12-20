import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { CouponCode } from "./couponCode";
export const getActiveSaleByCouponCode = async (couponCode: CouponCode) => {
    const ALL_SALES_QUERY_BY_COUPON_QUERY = defineQuery(`
        *[
            _type == "sales" && couponCode == couponCode && isActive == true
        ] | order(validFrom desc) [0]
    `)
    try {
        const activeSale = await sanityFetch({
            query: ALL_SALES_QUERY_BY_COUPON_QUERY,
            params: {
                couponCode
            }
        })
        return activeSale ? activeSale.data : null
    } catch (error) {
        console.error("Error fetching products:", error)
        return null
    }
}