import { SSRProvider } from 'react-bootstrap';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return(
    <SSRProvider>
      <Component {...pageProps} />
    </SSRProvider>
  ) 
}

export default MyApp
