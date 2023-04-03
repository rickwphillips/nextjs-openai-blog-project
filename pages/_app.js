import '../styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client';

function MyApp({ Component, pageProps }) {

  let getLayout = ((page, pageProps) => page);

  if (Component.hasOwnProperty('getLayout')) {
    getLayout = Component.getLayout;
  }

  return (
    <UserProvider>
      {getLayout(<Component {...pageProps} />, pageProps)}
    </UserProvider>
  )
}

export default MyApp
