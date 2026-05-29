import styled from 'styled-components'
import theme from '../../styles/theme'

export const StyledImgContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  height: auto;
  margin: 0;
  padding: 0;
  display: block;
`

export const StyledImg = styled.img`
  width: 100%;
  max-width: 100vw;
  height: auto;
  margin: 0;
  padding: 0;
  display: block;
  background-size: cover;
  border-radius: 0.2em;
`

export const StyledInput = styled.input`
  display: block;
  padding: 20px;
  font-size: 20px !important;
  width: 100%;
  border: 1px solid ${theme.colors.lightSlate};
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 10px;
  outline: none;
`

export const StyledTextArea = styled.textarea`
  display: block;
  padding: 20px;
  font-size: 20px !important;
  width: 100%;
  border: 1px solid ${theme.colors.lightSlate};
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 10px;
  outline: none;
`

export const StyledSelect = styled.select`
  display: block;
  padding: 20px;
  font-size: 20px !important;
  width: 100%;
  border: 1px solid ${theme.colors.lightSlate};
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 10px;
  outline: none;
`

export const StyledForm = styled.form`
  &:p {
    display: grid;
  }
`

export const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;

  '&: > div' {
    padding: 50px;
  }
`
