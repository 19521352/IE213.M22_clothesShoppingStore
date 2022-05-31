document.addEventListener('DOMContentLoaded', function () {
  var skuId
  var deleteSkuForm = document.forms['delete-sku-form']
  var btnDeleteSku = document.getElementById('btn-delete-sku')
  var checkboxAll = $('#checkbox-all')
  var productItemCheckbox = $('input[name="productIds[]"]')
  var checkBoxSubmitBtn = $('.check-box-submit-btn')

  // When dialog confirm clicked
  $('#delete-sku-modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    skuId = button.data('id').split(" ")
  })

  // When dialog sku btn clicked
  btnDeleteSku.onclick = function () {
    deleteSkuForm.action = '/products/' + skuId[0] + '/deleteSku/' + skuId[1]
    deleteSkuForm.submit()
  }

  // When checkbox all clicked
  checkboxAll.change(function () {
    var isCheckedAll = $(this).prop('checked')
    productItemCheckbox.prop('checked', isCheckedAll)
    renderCheckBoxSubmitBtn()
  })
  // product item checkbox change
  productItemCheckbox.change(function () {
    var isCheckedAll = productItemCheckbox.length === $('input[name="productIds[]"]:checked').length
    checkboxAll.prop('checked', isCheckedAll)
    renderCheckBoxSubmitBtn()
  })
  // Re-render check box submit button
  function renderCheckBoxSubmitBtn() {
    var checkedCount = $('input[name="productIds[]"]:checked').length
    if (checkedCount) {
      checkBoxSubmitBtn.attr('disabled', false)
    } else {
      checkBoxSubmitBtn.attr('disabled', true)
    }
  }
})
