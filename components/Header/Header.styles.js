import styled from 'styled-components'
import theme from '../../styles/theme'

export const StyledNavContainer = styled.header`
  border-bottom: ${theme.border};
  height: 50px;
  display: flex;
  height: 50px;
  align-items: space-between;
  justify-content: center;
`

export const StyledNav = styled.nav`
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: space-between;
  justify-content: flex-end;
  margin-left: auto;
`

export const StyledNavUl = styled.ul`
  padding: 0;
  margin-left: auto;
`

export const StyledNavLi = styled.li`
  display: inline-block;
`

export const StyledUserName = styled.li`
  padding: 1em 0.5em;
  display: inline-block;
`

export const StyledNavLink = styled.a`
  display: block;
  margin-right: 15px;
`

export const StyledNavIcon = styled.img`
  float: left;
  width: 45px;
  height: 50px;
  border-bottom: ${theme.border};
`
