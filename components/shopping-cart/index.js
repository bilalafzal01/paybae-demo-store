import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useSelector } from 'react-redux'

import CheckoutStatus from '../../components/checkout-status'
import Item from './item'

const ShoppingCart = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const { cartItems } = useSelector((state) => state.cart)

  const priceTotal = useSelector((state) => {
    const cartItems = state.cart.cartItems
    let totalPrice = 0
    if (cartItems.length > 0) {
      cartItems.map((item) => (totalPrice += item.price * item.count))
    }

    return totalPrice
  })

  console.log(cartItems)
  // TODO: Bilal - add the checkout endpoint here
  const handlePaymentClick = async () => {
    setIsProcessing(true)
    const url = `https://gi46gicwmhxvqz5nztipbf4xny0bejop.lambda-url.us-east-1.on.aws`

    const variables = {
      arguments: {
        vendorId: '71dc1710-d3e6-4fee-ac31-97de899ce958',
        metadata: JSON.stringify(
          cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.count,
          }))
        ),
        successUrl: `${window.location.origin}/success`,
        failureUrl: `${window.location.origin}/failure`,
        products: JSON.stringify(
          cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.count,
            description: `${item.name} - ${item.size}`,
            image: `https://paybae-demo-store.vercel.app${item.thumb}`,
          }))
        ),
      },
    }

    const headers = {
      apikey: 'pk_dev_26026b43-541a-4a08-9188-c806c26b3876',
    }

    try {
      const { data } = await axios({
        method: 'POST',
        url,
        data: JSON.stringify(variables),
        headers,
      })
      toast.success(`Payment endpoint created!`)

      setIsProcessing(false)

      if (data.statusCode === 200) {
        // * wait 2 seconds before redirecting to the payment endpoint
        setTimeout(() => {
          window.location.href = data.body.redirectUrl
        }, 2000)
      }
    } catch (err) {
      console.log(err)
      toast.error('Something went wrong!')
      setIsProcessing(false)
    }
  }

  return (
    <section className='cart'>
      <div className='container'>
        <div className='cart__intro'>
          <h3 className='cart__title'>Shopping Cart</h3>
          <CheckoutStatus step='cart' />
        </div>

        <div className='cart-list'>
          {cartItems.length > 0 && (
            <table>
              <tbody>
                <tr>
                  <th style={{ textAlign: 'left' }}>Product</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th></th>
                </tr>

                {cartItems.map((item) => (
                  <Item key={item.id} id={item.id} thumb={item.thumb} name={item.name} color={item.color} price={item.price} size={item.size} count={item.count} />
                ))}
              </tbody>
            </table>
          )}

          {cartItems.length === 0 && <p>Nothing in the cart</p>}
        </div>

        <div className='cart-actions'>
          <a href='/products' className='cart__btn-back'>
            <i className='icon-left'></i> Continue Shopping
          </a>
          <input type='text' placeholder='Promo Code' className='cart__promo-code' />

          <div className='cart-actions__items-wrapper'>
            <p className='cart-actions__total'>
              Total cost <strong>{priceTotal.toFixed(2)} MATIC</strong>
            </p>
            <button
              //  href='/cart/checkout'
              onClick={handlePaymentClick}
              className='btn btn--rounded btn--yellow'
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <i className='icon-spinner icon-spin'></i>
                  Processing
                </>
              ) : (
                `Checkout`
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShoppingCart
