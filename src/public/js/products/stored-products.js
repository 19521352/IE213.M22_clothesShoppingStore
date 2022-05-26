document.addEventListener('DOMContentLoaded', function () {
  var productId
  var deleteForm = document.forms['delete-product-form']
  var btnDeleteProduct = document.getElementById('btn-delete-product')

  // When dialog confirm clicked
  $('#delete-product-modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    productId = button.data('id')
    console.log(productId)
  })
  // When dialog product btn clicked
  btnDeleteProduct.onclick = function () {
    deleteForm.action = '/products/' + productId + '/delete'
    deleteForm.submit()
  }

})
