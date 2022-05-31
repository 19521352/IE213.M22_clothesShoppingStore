document.addEventListener('DOMContentLoaded', function () {
  var productId
  var deleteForm = document.forms['delete-product-form']
  var containerForm = document.forms['container-form']
  var btnDeleteProduct = document.getElementById('btn-delete-product')
  var checkboxAll = $('#checkbox-all')
  var productItemCheckbox = $('input[name="productIds[]"]')
  var checkBoxSubmitBtn = $('.check-box-submit-btn')

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
  // Check box submit button clicked
  checkBoxSubmitBtn.on('submit', function (e) {
    var isSubmitable = !$(this).hasClass('disabled')
    if (!isSubmitable) {
      e.preventDefault()
    }
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
