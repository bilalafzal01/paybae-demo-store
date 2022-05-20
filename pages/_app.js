import React, { Fragment } from 'react'
import { Toaster } from 'react-hot-toast'
import { wrapper } from '../store'

// global styles
import 'swiper/swiper.scss'
import 'rc-slider/assets/index.css'
import 'react-rater/lib/react-rater.css'
import '../assets/css/styles.scss'

const MyApp = ({ Component, pageProps }) => (
  <Fragment>
    <Toaster />
    <Component {...pageProps} />
  </Fragment>
)

export default wrapper.withRedux(MyApp)
