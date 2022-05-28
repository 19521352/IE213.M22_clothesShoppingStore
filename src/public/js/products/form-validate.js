function validate(e, data) {
  // e.preventDefault();
  var sku = data.map(({ color, size }) => ({
    'color': color.color_type,
    'size': size.size_type
  }))
  var colorItemArr = document.getElementsByName('color')
  var colorItem
  for (var i = 0, length = colorItemArr.length; i < length; i++) {
    if (colorItemArr[i].checked) {
      if (colorItemArr[i].value != 'other') colorItem = JSON.parse(colorItemArr[i].value)['color_type']
      else {
        // console.log(document.getElementById('inputOtherColorType').value)
        colorItem = document.getElementById('inputOtherColorType').value
      }
    }
  }
  var sizeItemArr = document.getElementsByName('size');
  var sizeItem
  for (var i = 0, length = sizeItemArr.length; i < length; i++) {
    if (sizeItemArr[i].checked) {
      if (sizeItemArr[i].value != 'other') sizeItem = JSON.parse(sizeItemArr[i].value)['size_type']
      else {
        // console.log(document.getElementById('inputOtherSizeType').value)
        sizeItem = document.getElementById('inputOtherSizeType').value
      }
    }
  }
  // console.log(colorItem, sizeItem)
  // console.log(sku)
  for (i in sku) {
    // console.log(sku[i].color, sku[i].size)
    if (sku[i].color == colorItem && sku[i].size == sizeItem) {
      alert(`Đã tồn tại sku có color: ${sku[i].color} và size: ${sku[i].size}`)
      return false
    }
  }
  return true
}