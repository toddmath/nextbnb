import Link from 'next/link'
import axios from 'axios'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  StyledNavContainer,
  StyledNavUl,
  StyledUserName,
  StyledNavLi,
  StyledNavLink,
  StyledNavIcon,
  StyledNav,
} from './Header.styles'

const Header = () => {
  const setShowLoginModal = useStoreActions(
    actions => actions.modals.setShowLoginModal
  )
  const setShowRegistrationModal = useStoreActions(
    actions => actions.modals.setShowRegistrationModal
  )
  const user = useStoreState(state => state.user.user)
  const setUser = useStoreActions(actions => actions.user.setUser)

  return (
    <StyledNavContainer>
      <Link href='/'>
        <a>
          <StyledNavIcon src='/img/logo.png' alt='' />
        </a>
      </Link>

      <StyledNav>
        <StyledNavUl>
          {user ? (
            <>
              <StyledUserName>{user}</StyledUserName>
              <StyledNavLi>
                <Link href='/bookings'>
                  <StyledNavLink>Bookings</StyledNavLink>
                </Link>
              </StyledNavLi>
              <StyledNavLi>
                <Link href='/host'>
                  <StyledNavLink>Your Houses</StyledNavLink>
                </Link>
              </StyledNavLi>
              <StyledNavLi>
                <Link href='/host/new'>
                  <StyledNavLink>Add House</StyledNavLink>
                </Link>
              </StyledNavLi>
              <StyledNavLi>
                <StyledNavLink
                  href='#'
                  onClick={async () => {
                    await axios.post('/api/auth/logout')
                    setUser(null)
                  }}
                >
                  Log out
                </StyledNavLink>
              </StyledNavLi>
            </>
          ) : (
            <>
              <StyledNavLi>
                <StyledNavLink
                  href='#'
                  onClick={() => setShowRegistrationModal()}
                >
                  Sign up
                </StyledNavLink>
              </StyledNavLi>
              <StyledNavLi>
                <StyledNavLink href='#' onClick={() => setShowLoginModal()}>
                  Log in
                </StyledNavLink>
              </StyledNavLi>
            </>
          )}
        </StyledNavUl>
      </StyledNav>
    </StyledNavContainer>
  )
}

export default Header
