import { getActiveSaleByCouponCode } from "@/sanity/lib/sales/getActiveSaleByCouponCode";
import { COUPON_CODES } from "@/sanity/lib/sales/couponCode";

async function BlackFridayBanner() {
    const sale = await getActiveSaleByCouponCode(COUPON_CODES.BFRIDAY);
    if (!sale?.isActive) return null
    return <div className="bg-gradient-to-r from-red-500 to-black text-white font-bold py-10 px-6 mx-4 mt-2 rounded shadow-lg">
        <div className="container mx-auto flex flex-col justify-items-start">
            <div className="flex-1">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-left mb-4">{sale.title}</h2>
        <p className="text-left text-2xl sm:text-3x font-semibold mb-6">{sale.description}</p>
            </div>
            <div className="flex">
                <div className="bg-white text-black py-4 px-6 rounded-full shadow-md transform hover: scale-105 transition duration-300">
                    <span className="font-bold text-base sm:text-xl">Use Code: {" "}</span>
                    <span className="text-red-600">{sale.couponCode}</span>
                    <span className="ml-2 font-bold text-base sm:text-xl">for {sale.discountAmount}% OFF</span>
                </div>
            </div>
            </div> 
    </div>
}

export default BlackFridayBanner