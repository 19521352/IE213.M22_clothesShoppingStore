const deleteCartItem = (btn) => {
  const cartItemId = btn.parentNode.querySelector('[name=cartItemId]').value

  const cartItemElement = btn.closest('tr')

  const cartTotalPriceElement = document.querySelector('#cart-total')
  const cartSubTotalPriceElement = document.querySelector('#cart-subtotal')
  const cartShippingFeeElement = document.querySelector('#cart-shipping-fee')

  fetch(`/cart/delete-item/${cartItemId}`, {
    method: 'DELETE',
  })
    .then((result) => result.json())
    .then(({ cart }) => {
      cartItemElement.parentNode.removeChild(cartItemElement)

      cartSubTotalPriceElement.textContent = cart.subTotal
      cartShippingFeeElement.textContent = cart.shippingFee
      cartTotalPriceElement.textContent = cart.subTotal + cart.shippingFee
    })
    .catch((err) => console.log(err))
}

const updateCartItem = async (btn, action) => {
  try {
    const cartItemId = btn.parentNode.querySelector('[name=cartItemId]').value
    const cartQuantityElement = btn.parentNode.querySelector('[name=quantity]')
    const cartItemTotalPriceElement =
      btn.parentNode.parentNode.parentNode.querySelector('#item-total-price')

    const cartTotalPriceElement = document.querySelector('#cart-total')
    const cartSubTotalPriceElement = document.querySelector('#cart-subtotal')
    const cartShippingFeeElement = document.querySelector('#cart-shipping-fee')

    const rawResponse = await fetch(`/cart/update-item/:id?action=${action}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartItemId, action }),
    })

    const { updatedCartItem, cart } = await rawResponse.json()

    cartQuantityElement.textContent = updatedCartItem.quantity
    cartItemTotalPriceElement.textContent =
      updatedCartItem.price.base *
      (1 - updatedCartItem.price.discount) *
      updatedCartItem.quantity

    cartSubTotalPriceElement.textContent = cart.subTotal
    cartShippingFeeElement.textContent = cart.shippingFee
    cartTotalPriceElement.textContent = cart.subTotal + cart.shippingFee
  } catch (err) {
    console.log(err)
  }
}
