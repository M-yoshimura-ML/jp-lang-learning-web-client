import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import { AuthProvider } from '../context/AuthContext'
import Script from 'next/script'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-9LLYFBFMNR"></Script>
      <Script id="google-analytics">
        {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
        
                gtag('config', 'G-9LLYFBFMNR');
        `}
      </Script>
      <Component {...pageProps} /> 
    </AuthProvider>
  )

}

export default MyApp
