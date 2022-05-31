document.addEventListener('DOMContentLoaded', function () {
  var orderId
  var deleteForm = document.forms['cancel-order-form']
  var btnDeleteProduct = document.getElementById('btn-cancel-order')

  // When dialog confirm clicked
  $('#cancel-order-modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    orderId = button.data('id')
    console.log(orderId)
  })
  // When dialog product btn clicked
  btnDeleteProduct.onclick = function () {
    deleteForm.action = '/orders/cancel/' + orderId
    deleteForm.submit()
  }
})
