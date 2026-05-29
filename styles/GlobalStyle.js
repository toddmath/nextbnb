import { createGlobalStyle } from 'styled-components'
import theme from './theme'
import media from './media'

const { colors, fontSizes, border, borderRadius, lineHeight } = theme

const GlobalStyle = createGlobalStyle`
html {
    box-sizing: border-box;
    width: 100%;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    margin: 0;
    font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI,
      Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
      sans-serif;
    font-size: ${fontSizes.sm};
    line-height: ${lineHeight};
    color: ${colors.text};
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    width: 100%;
    min-height: 100%;
    ${media.phablet`font-size: ${fontSizes.smish};`}

    &.hidden {
      overflow: hidden;
    }
    &.blur {
      overflow: hidden;
      #root > #content > * {
        filter: blur(5px) brightness(0.7);
        transition: ${theme.transition};
        pointer-events: none;
        user-select: none;
      }
    }
  }

  ::selection {
    background-color: ${colors.highlight};
  }

  button {
    background-color: ${colors.button};
    color: white;
    font-size: 0.9rem;
    width: 100%;
    border: none;
    height: 40px;
    border-radius: 4px;
    cursor: pointer;
  }

  input[type='text'],
  input[type='email'],
  input[type='password'] {
    display: block;
    padding: 20px;
    font-size: 1.2rem;
    width: 100%;
    border: ${border};
    box-sizing: border-box;
    margin-bottom: 10px;
    border-radius: ${borderRadius};
    outline: 0;

    &:focus {
      outline: 0;
    }

    &::placeholder {
    }

    &:focus,
    &:active {
      &::placeholder {
        opacity: 0.5;
      }
    }
  }

  img {
    border-radius: ${borderRadius};
    width: 100%;
    max-width: 100%;
    vertical-align: middle;
  }

  a {
    display: inline-block;
    color: inherit;
    text-decoration: none;
    text-decoration-skip-ink: auto;
    position: relative;
    transition: ${theme.transition};
    cursor: pointer;

    &:hover,
    &:focus {
      color: ${colors.link};
      outline: 0;
    }
  }

  ul, ol {
    padding: 0;
    margin: 0;
    list-style: none;
  }
`

export default GlobalStyle
