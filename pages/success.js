import Link from 'next/link'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { resetCart } from '../store/actions/cartActions'
import Layout from '../layouts/Main'
import Footer from '../components/footer'

const SuccessPage = ({ checkoutID, status }) => {
  const dispatch = useDispatch()

  // * check the status here. If it is completed, then reset the cart
  useEffect(() => {
    if (status === 'completed') {
      dispatch(resetCart())
    }
  }, [])

  return (
    <Layout>
      <div className='success__root'>
        <div className='success__root__container'>
          <div className='success__root__svg__container'>
            <svg viewBox='0 0 24 24' className='success__root__svg'>
              <path fill='currentColor' d='M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z'></path>
            </svg>
          </div>
          <div className='success__root__content'>
            <h3 className=''>Payment Done!</h3>
            <p className='subtext'>Thank you for completing your secure Paybae payment.</p>
            <p> Have a great day! </p>
            <div className='action'>
              <Link href='/' className='btn btn--rounded btn--yellow'>
                <a className='btn btn--rounded btn--yellow'>GO BACK</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  )
}

export default SuccessPage

export const getServerSideProps = async (context) => {
  if (context.query) {
    const { checkoutId } = context.query

    console.log('checkoutID', checkoutId)

    if (checkoutId === 'favicon.ico') {
      return {
        props: {
          checkoutID: '',
        },

        redirect: {
          destination: '/',
        },
      }
    }

    // * now we will fetch the checkout from the lambda
    const url = `https://cmj43gdw6qrzee4g5kdoyxcwru0joxne.lambda-url.us-east-1.on.aws/?checkoutId=${checkoutId}`

    const response = await fetch(url)
    const data = await response.json()

    console.log(data)
    if (data.statusCode === 200) {
      // * if status is completed or failed, we redirect to the checkout success or failure page
      if (data.body.data.status === 'completed') {
        return {
          props: {
            checkoutID: checkoutId,
            status: 'completed',
          },
        }
      }

      if (data.body.data.status === 'failed') {
        return {
          props: {
            checkoutID: checkoutId,
          },

          redirect: {
            destination: `${data.body.data.failureUrl}?checkoutId=${checkoutID}`,
          },
        }
      }

      return {
        props: {
          checkoutID: checkoutId,
        },

        // * if status is pending, we redirect to the checkout page
        redirect: {
          destination: `https://paybae-checkout.com/${data.body.data.checkoutId}`,
        },
      }
    }
  }

  // * in other cases redirect to 404
  return {
    props: {
      checkoutID: '',
    },

    redirect: {
      destination: '/404',
    },
  }
}
