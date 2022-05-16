function getMin(arr) {
  return Math.min(...arr)
}

function getMax(arr) {
  return Math.max(...arr)
}

function getTotalQuantity(obj) {
  const quantity = (obj.map(d => d.quantity)).reduce((total, num) => total + num)
  return quantity
}

function setPrice(obj) {
  const minPriceBase = getMin(obj.map(d => d.price.base.$numberDecimal))
  const maxPriceBase = getMax(obj.map(d => d.price.base.$numberDecimal))
  const minPrice = getMin(obj.map(d => d.price.base.$numberDecimal * (1 - d.price.discount.$numberDecimal)))
  const maxPrice = getMax(obj.map(d => d.price.base.$numberDecimal * (1 - d.price.discount.$numberDecimal)))

  var dataObj = Object.assign(obj[0], { 'minPrice': minPrice }, { 'maxPrice': maxPrice })
  if (minPrice != minPriceBase) {
    dataObj = Object.assign(dataObj, { 'minPriceBase': minPriceBase })
  }
  if (maxPrice != maxPriceBase) {
    dataObj = Object.assign(dataObj, { 'maxPriceBase': maxPriceBase })
  }
  return dataObj
}

function sizeBtnClick(data) {
  const colorItemBtn = $('input[name="productColorList[]"]:checked')
  if (colorItemBtn.length) {
    reRenderDetail(data.find(e => e.color.color == colorItemBtn[0].value))
  } else {
    var dataObj = setPrice(data)
    dataObj = Object.assign(dataObj, { 'quantity': getTotalQuantity(data) })
    reRenderDetail(dataObj)
  }
  const colorArr = data.map(e => (e.color.color))
  disableBtn(colorArr, "productColorList[]")
}

function colorBtnClick(data) {
  const sizeItemBtn = $('input[name="productSizeList[]"]:checked')
  if (sizeItemBtn.length) {
    reRenderDetail(data.find(e => e.size.size_type == sizeItemBtn[0].value))
  }
  else {
    var dataObj = setPrice(data)
    dataObj = Object.assign(dataObj, { 'quantity': getTotalQuantity(data) })
    reRenderDetail(dataObj)
  }
  // Disable color btn
  const sizeArr = data.map(e => (e.size.size_type))
  disableBtn(sizeArr, "productSizeList[]")
  // reRenderDetail(data.find(e => e.size.sizeType == sizeItemBtn[0].value))
}

function reRenderDetail(detailObj) {
  console.log(detailObj)
  document.querySelector('#quantity').innerHTML = detailObj.quantity
  document.querySelector('.view-product img').src = detailObj.image
  // document.querySelector('#price').innerHTML = detailObj.price.base.$numberDecimal + " " + detailObj.price.currency
  // document.querySelector('').innerHTML = detailObj
  var price = ""
  var priceBase = ""
  if ('maxPrice' in detailObj) {
    if (detailObj.maxPrice != detailObj.maxPriceBase && detailObj.minPrice != detailObj.minPriceBase) {
      if (detailObj.minPriceBase != detailObj.maxPriceBase) {
        priceBase += detailObj.minPriceBase + ' - '
      }
      priceBase += detailObj.maxPriceBase + " " + detailObj.price.currency
      document.querySelector('#priceBefore').innerHTML = priceBase
    }

    if (detailObj.minPrice != detailObj.maxPrice) {
      price += detailObj.minPrice + ' - '
    }
    price += detailObj.maxPrice + " " + detailObj.price.currency
  } else {
    if (detailObj.price.base.$numberDecimal != detailObj.price.base.$numberDecimal * (1 - detailObj.price.discount.$numberDecimal)) {
      priceBase += detailObj.price.base.$numberDecimal + " " + detailObj.price.currency
      price += detailObj.price.base.$numberDecimal * (1 - detailObj.price.discount.$numberDecimal) + " " + detailObj.price.currency
    } else {
      price += detailObj.price.base.$numberDecimal + " " + detailObj.price.currency
    }
  }
  document.querySelector('#priceCurrent').innerHTML = price
}

function disableBtn(arr, ttr) {
  const eleList = document.querySelectorAll(`input[name="${ttr}"]`)
  for (i in eleList) {
    if (eleList.hasOwnProperty(i)) {
      if (arr.find(e => e == eleList[i].value)) {
        eleList[i].removeAttribute('disabled', '')
      } else {
        eleList[i].setAttribute('disabled', '')
      }
    }
  }
}

function imgClick(imgClicked) {
  var imgOnView = $('#imgOnView')
  console.log(imgOnView)
  imgOnView.attr("src", imgClicked.src)
}