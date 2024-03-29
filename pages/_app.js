import '../styles/globals.css'
// import 'bootstrap/dist/css/bootstrap.min.css';

import 'bulma/css/bulma.min.css';
import 'react-toastify/dist/ReactToastify.css';

import * as ga from '../lib/google_analytics'
import { useEffect } from 'react';
import { useRouter } from 'next/dist/client/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (process.env.NODE_ENV !== `development`) {
        ga.pageview(url)
      }
    }
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return <Component {...pageProps} />
}

export default MyApp
