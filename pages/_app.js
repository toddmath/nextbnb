import App from 'next/app'
import { StoreProvider } from 'easy-peasy'
import { ThemeProvider } from 'styled-components'
import { DefaultSeo } from 'next-seo'
import store from '../store'
import theme from '../styles/theme'

// const theme = {
//   colors: {
//     primary: '#0070f3',
//     button: 'rgb(255, 90, 95)',
//     text: 'rgb(48, 46, 40)',
//     link: 'rgb(131, 42, 156)',
//   },
//   borderRadius: '0.2em',
//   border: '1px solid #ccc',
//   lineHeight: '1.5',
//   sizes: {
//     text: '14px',
//     mainWidth: '72em',
//   },
// }

function MyApp({ Component, pageProps, user }) {
  if (user) {
    store.getActions().user.setUser(user)
  }

  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <DefaultSeo
          title='nextbnb'
          description='nextbnb is a airbnb proof-of-concept clone'
          openGraph={{
            type: 'website',
            locale: 'en_IE',
            url: 'http://localhost:3000',
            site_name: 'Nextbnb',
          }}
          twitter={{
            handle: '@tM0Nk3y',
            cardType: 'summary_large_image',
          }}
        />
        <Component {...pageProps} />
      </ThemeProvider>
    </StoreProvider>
  )
}

MyApp.getInitialProps = async appContext => {
  // calls page's `getInitialProps` and fills `appProps.pageProps
  const appProps = await App.getInitialProps(appContext)

  let user = null
  if (
    appContext.ctx.req &&
    appContext.ctx.req.session &&
    appContext.ctx.req.session.passport &&
    appContext.ctx.req.session.passport.user
  ) {
    user = appContext.ctx.req.session.passport.user
  }

  // eslint-disable-next-line object-shorthand
  return { ...appProps, user: user }
}

export default MyApp
