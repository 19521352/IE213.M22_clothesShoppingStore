document.addEventListener('DOMContentLoaded', function () {
  var skuId
  var deleteSkuForm = document.forms['delete-sku-form']
  var btnDeleteSku = document.getElementById('btn-delete-sku')
  console.log(btnDeleteSku)
  // When dialog confirm clicked
  $('#delete-sku-modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    skuId = button.data('id').split(" ")
    console.log(button)
    console.log(skuId)
  })

  // When dialog sku btn clicked
  btnDeleteSku.onclick = function () {
    deleteSkuForm.action = '/products/' + skuId[0] + '/deleteSku/' + skuId[1]
    deleteSkuForm.submit()
  }

})
