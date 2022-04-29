document.addEventListener('DOMContentLoaded', function () {
  const sizeItemBtn = $('label[name="productColorList[]"]')
  sizeItemBtn.onclick = function () {
    var isChecked = $(this).hasClass('active')
    console.log(isChecked)
  }
  console.log(sizeItemBtn)
})