module.exports = {
  getPrice: function (object) {
    // var arr = object.map(d => d[field.split('.')])
    var priceBaseListArr = object.map(d => d.price.base)
    const minPriceBase = Math.min(...priceBaseListArr)
    const maxPriceBase = Math.max(...priceBaseListArr)

    var priceListArr = object.map(d => d.price.base * (1 - d.price.discount))
    const minPrice = Math.min(...priceListArr)
    const maxPrice = Math.max(...priceListArr)
    return { minPriceBase, maxPriceBase, minPrice, maxPrice }
  },
  getTotalQuantity: function (object) {
    var quantity = 0
    if (object.length) quantity = (object.map(d => d.quantity)).reduce((total, num) => total + num)
    return quantity
  }
}

