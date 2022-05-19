import toast from 'react-hot-toast'
import axios from 'axios'
import { useSelector } from 'react-redux'

import CheckoutStatus from '../../components/checkout-status'
import Item from './item'

const ShoppingCart = () => {
  const { cartItems } = useSelector((state) => state.cart)

  const priceTotal = useSelector((state) => {
    const cartItems = state.cart.cartItems
    let totalPrice = 0
    if (cartItems.length > 0) {
      cartItems.map((item) => (totalPrice += item.price * item.count))
    }

    return totalPrice
  })

  // TODO: Bilal - add the checkout endpoint here
  const handlePaymentClick = async () => {
    const url = `https://gi46gicwmhxvqz5nztipbf4xny0bejop.lambda-url.us-east-1.on.aws`
    const variables = {
      arguments: {
        vendorId: '71dc1710-d3e6-4fee-ac31-97de899ce958',
        metadata: 'some data',
        successUrl: 'checkout.paybae.io',
        failureUrl: 'checkout.paybae.io/failure',
        products: [
          {
            id: '407a919e-f739-4691-b60b-7b0f67704f3f',
            name: 'test 1',
            price: 4.4,
            quantity: 3,
            description: 'some product',
          },
          {
            id: '407a919e-f739-4691-b60b-7b0f6770s4rh',
            name: 'test 2',
            price: 2.4,
            quantity: 3,
            description: 'some product',
          },
          {
            id: '407a919e-f739-4691-b60b-7b0f6770adv5',
            name: 'test 3',
            price: 1.4,
            quantity: 3,
            description: 'some product',
          },
        ],
      },
    }

    const headers = {
      'Content-Type': 'application/json',
      ApiKey: '',
    }

    try {
      const { data } = await axios.post(url, variables, headers)
      toast.success(data)
    } catch (err) {
      console.log(err)
      toast.error('Something went wrong!')
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
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShoppingCart
