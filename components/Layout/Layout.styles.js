/* eslint-disable import/prefer-default-export */
import styled from 'styled-components'
import theme from '../../styles/theme'

const { sizes } = theme

export const StyledMain = styled.main`
  position: relative;
  max-width: ${sizes.mainWidth};
  background-color: white;
  padding: 2em;
  margin: 0 auto;
  box-sizing: border-box;
`
