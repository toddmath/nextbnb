/* eslint-disable jsx-a11y/no-static-element-interactions */
import styled from 'styled-components'

const StyledModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
`

const StyledModal = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: calc(100vw - 4em);
  max-width: 32em;
  max-height: calc(100vh - 4em);
  overflow: auto;
  transform: translate(-50%, -50%);
  padding: 1em;
  border-radius: 0.2em;
  background: white;
`

export default ({ close, children }) => (
  <div className='nav-container'>
    <StyledModalBackground onKeyDown={close} onClick={() => close()} />
    <StyledModal>{children}</StyledModal>
  </div>
)
