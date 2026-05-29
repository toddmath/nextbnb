import Head from 'next/head'
import { useStoreState, useStoreActions } from 'easy-peasy'
import Modal from '../Modal'
import LoginModal from '../LoginModal'
import RegistrationModal from '../RegistrationModal'
import Header from '../Header/Header.component'
import { StyledMain } from './Layout.styles'
import GlobalStyle from '../../styles/GlobalStyle'

const Layout = ({ children }) => {
  const showModal = useStoreState(state => state.modals.showModal)
  const showLoginModal = useStoreState(state => state.modals.showLoginModal)
  const showRegistrationModal = useStoreState(
    state => state.modals.showRegistrationModal
  )

  const setHideModal = useStoreActions(actions => actions.modals.setHideModal)
  const setShowRegistrationModal = useStoreActions(
    actions => actions.modals.setShowRegistrationModal
  )
  const setShowLoginModal = useStoreActions(
    actions => actions.modals.setShowLoginModal
  )

  return (
    <div>
      <Head>
        <script src='https://js.stripe.com/v3/' />
      </Head>
      <Header />
      <GlobalStyle />
      <StyledMain>{children}</StyledMain>

      {showModal && (
        <Modal close={() => setHideModal()}>
          {showLoginModal && (
            <LoginModal showSignup={() => setShowRegistrationModal()} />
          )}
          {showRegistrationModal && (
            <RegistrationModal showLogin={() => setShowLoginModal()} />
          )}
        </Modal>
      )}
    </div>
  )
}

export default Layout
