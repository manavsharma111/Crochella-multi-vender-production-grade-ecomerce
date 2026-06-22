const calculateDynamicPrice = (product) => {
    if (!product) return 0;
    
    let finalPrice = product.price || 0;
    // time sale
    if (product.isFlashSale && product.flashSalePrice && product.flashSaleEndTime) {
        const now = new Date()
        const endTime = new Date(product.flashSaleEndTime)
        if (now < endTime) {
            finalPrice = product.flashSalePrice
        }
    }
    // scarcity based pricing
    if (product.stock > 0 && product.stock <= 3) {
        finalPrice = Math.round(finalPrice * 1.10)
    }
    return finalPrice
}

module.exports = { calculateDynamicPrice }
